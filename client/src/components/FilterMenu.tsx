import React, {ChangeEvent, FunctionComponent, memo} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import {makeStyles, MenuItem} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core";

import type {WhereInput} from "../generated-api";

type FilterMenuProps = {
  isDataFetchInProgress: boolean;
  onFilterClick: () => unknown;
  onChange: (property: keyof WhereInput, value: any) => unknown;
  onClearFilterClick: () => unknown;
  state: WhereInput;
};

const useFilterMenuStyles: CallableFunction = makeStyles((theme: Theme) => ({
  formControl: {
    minWidth: 120,
  },
  clearBtn: {
    marginTop: theme.spacing(1)
  }
}));

const FilterMenu: FunctionComponent<FilterMenuProps> = ({ isDataFetchInProgress, onFilterClick, onChange, onClearFilterClick, state }) => {
  const classes = useFilterMenuStyles();
  console.log("rendering")

  //note: some fields cannot be reset with null value so I have provided an empty string
  return (
    <>
      <Grid
        container
        spacing={5}
      >
        <Grid item>
          <TextField
            value={state.name_contains ?? ''}
            label="Name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('name_contains', e.target.value)}
          />
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Type</InputLabel>
            <Select
              value={state.type_eq}
              onChange={(e: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => onChange('type_eq', e.target.value)}
            >
              <MenuItem value="File">File</MenuItem>
              <MenuItem value="Directory">Directory</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          {/* All files queried have size greater than the given value*/}
          <Box mt={2} />
          <Input
            placeholder="File size (greater than)"
            type="number"
            value={state.size_gt ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('size_gt', e.target.value)}
            endAdornment={<InputAdornment position="start">KB</InputAdornment>}
          />
        </Grid>
        <Grid item>
          {/* All files queried have size less than the given value*/}
          <Box mt={2} />
          <Input
            placeholder="File size (less than)"
            type="number"
            value={state.size_lt ?? ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange('size_lt', e.target.value)}
            endAdornment={<InputAdornment position="start">KB</InputAdornment>}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Modifed After"
            type="date"
            value={state.modified_after ?? ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange('modified_after', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        justifyContent="flex-end"
      >
        <Grid item>
          <Button
            className={classes.clearBtn}
            disabled={isDataFetchInProgress}
            onClick={onFilterClick}
            size="large"
            variant="outlined"
            color="primary"
          >
            Filter
          </Button>
        </Grid>
        <Grid item>
          <Box mr={3}>
            <Button
              className={classes.clearBtn}
              onClick={onClearFilterClick}
              size="large"
              variant="outlined"
              color="primary"
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

//Stop reconciliation process when data pertaining to this component did not
//change. I learned about the React optimization technique while I was
//writing this blog: https://ahamedblogs.wordpress.com/2020/02/12/six-least-known-facts-about-setstate/
export default memo(FilterMenu);
