export const titleGuard = (to, from, next) => {
  // console.log(to, from, next)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
}
