declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}
