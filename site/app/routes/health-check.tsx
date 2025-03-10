export function loader() {
  return new Response("OK", {
    headers: new Headers({ "Content-Type": "text/plain" }),
  });
}
