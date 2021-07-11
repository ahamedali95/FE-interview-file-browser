import React, {useState, useEffect, useMemo, FunctionComponent, useReducer, useCallback} from "react";
import dayjs from "dayjs";

// I believe material-ui supports tree shaking as it uses ES6 to construct its modules
// so we can able to write more simplified import statements. To confirm,
// we can use the webpack-bundle-analyzer plugin to inspect the bundle size.
// I once get to explore tree-shaking, please check it out: https://ahamedblogs.wordpress.com/2020/02/11/reducing-js-bundle-sizes-using-tree-shaking/
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableRow from "@material-ui/core/TableRow";
import {makeStyles} from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import ReportProblem from "@material-ui/icons/ReportProblem";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight";

import Alert from "@material-ui/lab/Alert";

import {useListEntriesLazyQuery} from "../generated-api";
import type { File, Entry, ListEntriesQueryVariables, WhereInput} from "../generated-api";
import FormatUtil from "../util/FormatUtil";
import FilterMenu from "./FilterMenu";
import CustomTableHead from "./CustomTableHead";
import {filterReducer} from "../reducers";
import {initialState as filterInitialState} from "../reducers/filterReducer";

const useStyles: CallableFunction = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  // I have worked in data-rich blotter applications which gives a consolidated view of all investment orders in the system.
  // Sometimes it is hard to differentiate information between rows within the grid since they all have same appearance.
  // This is very vivid when a grid has columns that spans horizontally and users have to scroll to view all the columns.
  // Given that experience, I applied background color to even-indexed rows to help users differentiate the rows.
  evenRow: {
    backgroundColor: "#fcf2ff"
  }
}));

type UP = {
  __typename?: "UP_DIR";
  id: string;
  path: string;
  name: string;
};

type ENTRY_UP = Entry | UP;

const DataGrid: FunctionComponent = () => {
  const classes = useStyles();
  const bytesPerKB = 1_000;
  const [ state, dispatch ] = useReducer(filterReducer, filterInitialState, undefined);
  const [ sortType, setSortType ] = useState<"desc" | "asc" | undefined>(undefined);
  const [ sortField, setSortField ] = useState<keyof Entry | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [currentPath, setCurrentPath] = useState("/");
  const [history, updateHistory] = useState<{ id: string, path: string }[]>(
    [{
      id: "/",
      path: "/",
    }]
  );

  // Following is my intention behind using useLazyQuery hook versus standard useQuery:
  // From my experience, having a spontaneous filtering leads to side effects and negatively affect user experience especially when it comes to
  // data-rich web applications. For example, I worked on a trading blotter
  // application which gives a consolidated view of all the orders in the system. In this application,
  // lot of the data points are subject to change post order submission. To confirm the data, the server was
  // doing lot of processing tasks like communicating with external third-party services.
  // So live filtering is not an adequate solution, thus we implemented a apply filter button as means of confirmation
  // to perform the search. In our application, we might have files stored in a  cloud service if we are hosting.
  // The server needs adequate time to read metadata associated with our files. Having that thought leads me to add `Filter` button
  // to trigger the filtering task.
  const [ fetchEntries, { data, loading, error } ] = useListEntriesLazyQuery({});

  const getPayload = (): Record<"variables", ListEntriesQueryVariables> => {
    return {
      variables: {
        path: currentPath,
        page,
        where: {
          ...state,
          size_gt: Number(state.size_gt) * bytesPerKB,
          size_lt: Number(state.size_lt) * bytesPerKB
        }
      }
    };
  };

  useEffect((): void => {
    // When we switch between current path/pages, the previous filters get automatically applied
    // to our query.
    fetchEntries(getPayload());
  }, [ currentPath, page ]);

  useEffect((): void => {
    setCurrentPath(history[history.length - 1].path);
  }, [history]);

  const rows = useMemo(() => {
    const dataRows = data?.listEntries?.entries ?? [] as any;

    return [
      ...(history.length > 1 
        ? [
            {
              id: history[history.length - 2].id,
              path: history[history.length - 2].path,
              name: "UP_DIR",
              __typename: "UP_DIR"
            }
          ]
        : []),
      ...dataRows,
    ]
  }, [history.length, data?.listEntries?.entries]);

  const rowCount = useMemo(() => {
    const totalUpDirRows = currentPath === "/" 
      ? 0 
      : (data?.listEntries?.pagination.pageCount ?? 0) * 1
    const totalRowsFromServer = data?.listEntries?.pagination.totalRows ?? 0
    return  totalRowsFromServer + totalUpDirRows
  }, [
    data?.listEntries?.pagination.pageCount, 
    data?.listEntries?.pagination.totalRows
  ]);

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleFilterClick = useCallback((): void => {
    fetchEntries(getPayload());
  }, [ currentPath, page, state ]);

  const handleChange = useCallback((property: keyof WhereInput, value: any): void => {
    dispatch({ type: "UPDATE_PROPERTY", property, value });
  }, [ dispatch ]);

  const handleClearFilterClick = useCallback((): void => {
    dispatch({ type: "RESET" });
  }, [ dispatch ]);

  const sort = (rows: ENTRY_UP[]): ENTRY_UP[] => {
    const comparator = (nameA: ENTRY_UP, nameB: ENTRY_UP, property: keyof Entry) => { //@ts-ignore
      if (nameA[property] < nameB[property]) return -1; //@ts-ignore
      if (nameA[property] > nameB[property]) return 1;
      return 0;
    };
    const directories = rows.filter(row => row.__typename === "Directory" || row.__typename === "UP_DIR");

    return !sortField ?
      rows
      :
      [ ...directories, ...rows.slice(directories.length).sort((a: ENTRY_UP, b: ENTRY_UP) => sortType === "asc" ? comparator(a, b, sortField) : -comparator(a, b, sortField)) ];
  };

  const getData = (): JSX.Element | JSX.Element[] => {
    if (loading) {
      // todo: unable to center both spinner and empty data message within table
      return (
        <Box
          display="flex"
          width="inherit"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      );
    } else if (!data?.listEntries?.entries.length) {
      return (
        <Box
          display="flex"
          width="inherit"
          alignItems="center"
          justifyContent="center"
        >
          <ReportProblem />
          <span>No files available</span>
        </Box>
      );
    } else {
      //@ts-ignore
      return sort(rows).map(({path, __typename, name, size, id, lastModified }, index: number): JSX.Element => {
        const isUpDir = __typename === "UP_DIR";

        return (
          <TableRow className={index % 2 === 0 ? classes.evenRow : ""} key={id}>
            <TableCell component="th" scope="row">
              <Button
                color="primary"
                disabled={__typename === "File"}
                startIcon={isUpDir
                  ? (<MoreHorizIcon />)
                  : (__typename === "File" ? null : <SubdirectoryArrowRightIcon />)
                }
                onClick={() => {
                  const h = history;

                  if (isUpDir && h.length > 1) {
                    setPage(1);
                    updateHistory([...h.splice(0, h.length - 1)])
                  } else {
                    updateHistory([...h, { id: path, path }])
                  }
                }}
              >
                {!isUpDir ? path : ""}
              </Button>
            </TableCell>
            <TableCell align="left">
              <>
                <span>{isUpDir ? "_" : name}</span>
                {
                  // Users may want to inspect the file by downloading them so provided the download option
                  // Ideally, clicking the download option will make a call to the backend to retrieve the file blob
                  // such that it can be converted to a readable file. This will use a rest service instead of graphql.
                  // We may also give a delete option at row level to delete the file.
                  __typename === "File" &&
                    <a
                      download={name}
                      href="/path/to/image"
                    >
                      <Box
                        ml={1}
                        display="inline"
                      >
                        <IconButton><GetAppRoundedIcon/></IconButton>
                      </Box>
                    </a>
                }
              </>
            </TableCell>
            <TableCell align="left">{isUpDir ? "_" : __typename}</TableCell>
            <TableCell align="right">
              {
                isUpDir ?
                  "_"
                  :
                  // One improvement we can make here is give a total size for directory as well.
                  __typename === "File" ?
                    FormatUtil.separateThousandsByComma(Math.round(size / bytesPerKB)) + " KB"
                    :
                    size
              }
            </TableCell>
            <TableCell align="left">
              {
                isUpDir ?
                  "_"
                  :
                  __typename === "File" ?
                    dayjs(lastModified).format("DD MMM YYYY")
                    :
                    lastModified
              }
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  const handleRequestSort = useCallback((property: keyof Entry) => {
    setSortType(sortType === "asc" ? "desc" : "asc");
    setSortField(property);
  }, [ sortType ]);

  return (
    <>
      {
        error &&
          <>
            <Box mt={3} />
            <Alert severity="error">Unable to retrieve records. Please try again later. If issue persists, please <Link href="mailto:wm.technical-support@percent.com?subject = Reporting Prod Issue">contact support</Link>.</Alert>
          </>
      }
      <Box
        display="flex"
        height="100%"
        mt={3}
      >
        <Box flexGrow={1}>
          <Paper>
            <Box mt={3} ml={3}>
              <FilterMenu
                isDataFetchInProgress={loading}
                onFilterClick={handleFilterClick}
                onClearFilterClick={handleClearFilterClick}
                onChange={handleChange}
                state={state}
              />
            </Box>
            <Box mt={3} />
            <TableContainer>
              <Table className={classes.table} size="small" aria-label="a dense table">
                <CustomTableHead
                  sortType={sortType}
                  sortField={sortField}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {getData()}
                </TableBody>
              </Table>
            </TableContainer>
            {
              !loading &&
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={rowCount}
                  rowsPerPage={25}
                  page={page - 1}
                  onChangePage={handleChangePage}
                  onPageChange={() => {}}/>
            }
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default DataGrid;
