function getImport() {
  return import("./module").then((module) => {
    return module.default;
  });
}
getImport().then((res) => {
  console.log(res);
});
