window.__ModuleLoader__.load({
  id: '@local/dsh-sarasa-mono',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const uiLatin = '"Sarasa Gothic SC","Sarasa UI SC","更纱黑体 Gothic SC","更纱黑体 UI SC",';
    const monoLatin = '"Sarasa Mono SC","更纱黑体 Mono SC",';
    const css = [
      ':root{',
      /* UI / proportional text (English + CJK body) */
      '--dsw-font-family:' + uiLatin +
        '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif;',
      /* all monospace surfaces: inline code, code blocks, terminals, ids */
      '--ds-font-family-code:' + monoLatin +
        '"SF Mono","JetBrains Mono","Fira Code",Consolas,"Liberation Mono",Menlo,Courier,"PingFang SC","Microsoft YaHei",monospace;',
      '--dsw-font-mono:' + monoLatin +
        'ui-monospace,SFMono-Regular,Menlo,Consolas,"Microsoft YaHei",monospace;',
      '}',
    ].join('');
    function SarasaStyle() {
      return h('style', { 'data-plugin': 'sarasa-fonts' }, css);
    }
    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'sarasa-mono', order: 900,
        }, SarasaStyle));
      },
    };
  },
});
