/**
 * This script will eventually execute on the client side.
 */
function clientScript() {
  // @ts-expect-error this is a client script
  const what = document.currentScript.getAttribute("data-what");

  if (!what) {
    throw new Error("data-what is required");
  }

  const thing = what === "system" || what === game.system.name

  // const name
  // const version = 
  // const major_version
  // const fvtt_version
  // const fvtt_major_version
  // const ip
  // const queryCountry

  fetch("//localhost:3000/api/hit/system/investigator")
  return `
    <script>
      window.__NEXT_REGISTER_PAGE('/api/hello', function() {
        return {
          page: () => import('./hello')
        }
      })
    </script>
  `;
}
