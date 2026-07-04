import { mock } from "../../../../../mock.ts"

export default mock({
  headers: {
    "content-type": "text/plain;charset=UTF-8",
    "x-github-api-version-selected": "2022-11-28",
  },
  body: new TextEncoder().encode(`
    MMM.           .MMM
    MMMMMMMMMMMMMMMMMMM
    MMMMMMMMMMMMMMMMMMM      ___________________________
   MMMMMMMMMMMMMMMMMMMMM    |                           |
  MMMMMMMMMMMMMMMMMMMMMMM   | For those who come after. |
 MMMMMMMMMMMMMMMMMMMMMMMM   |_   _______________________|
 MMMM::- -:::::::- -::MMMM    |/
  MM~:~ 00~:::::~ 00~:~MM
.. MMMMM::.00:::+:::.00::MMMMM ..
   .MM::::: ._. :::::MM.
      MMMM;:::::;MMMM
-MM        MMMMMMM
^  M+     MMMMMMMMM
   MMMMMMM MM MM MM
        MM MM MM MM
        MM MM MM MM
     .~~MM~MM~MM~MM~~.
  ~~~~MM:~MM~~~MM~:MM~~~~
 ~~~~~~==~==~~~==~==~~~~~~
  ~~~~~~==~==~==~==~~~~~~
      :~==~==~==~==~~`),
})
