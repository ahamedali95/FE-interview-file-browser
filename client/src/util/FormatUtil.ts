class FormatUtil {
  /**
   * @name separateThousandsByComma
   * @param {number} value - The value to convert
   * @return {string} - The converted value. Example: 1000 -> 1,000
   */
  static separateThousandsByComma(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export default FormatUtil;
