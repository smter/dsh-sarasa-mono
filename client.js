/**
 * Client half of @local/dsh-sarasa-mono.
 *
 * Why the obvious override cannot work: the shipped theme composes the UI font on
 * <body>, not on :root.
 *
 *   :root{ --dsw-font-family: var(--dsh-font-family-text-default); … }
 *   body { --dsw-font-family: var(--dsh-font-family-text, var(--dsh-font-family-text-default)), var(--dsh-font-family-text-default);
 *          --ds-font-family-code: var(--dsh-font-family-code, …), …; }
 *   body { font-family: var( --dsw-font-family, …) }
 *
 * Because <body> redeclares those composed names itself, a :root override never
 * reaches <body> or any descendant. The real knobs are the role variables
 * --dsh-font-family-text|code|terminal, and the layout ThemePresenter writes the
 * user's lists into them as INLINE body styles, so a plain author rule loses.
 * Author '!important' outranks inline styles, so that is what we use, and only for
 * roles the user has not already customized in Settings — their choice keeps
 * winning, and the style re-syncs when the body style changes.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-sarasa-mono',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Proportional UI stack: installed Sarasa families first, shipped fallbacks after. */
    const UI_FAMILIES = [
      '"Sarasa UI SC"', '"更纱黑体 UI SC"', '"Sarasa Gothic SC"', '"更纱黑体 Gothic SC"',
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"',
      '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif',
    ].join(', ');

    /** Monospace stack: Sarasa Mono first, then the shipped code fallbacks. */
    const MONO_FAMILIES = [
      '"Sarasa Mono SC"', '"等距更纱黑体 SC"', '"Sarasa Mono SC Nerd Font"', '"SF Mono"',
      '"JetBrains Mono"', '"Fira Code"', 'Consolas', '"Liberation Mono"', 'Menlo', 'Courier',
      '"PingFang SC"', '"Microsoft YaHei"', 'monospace',
    ].join(', ');

    /** Body variables the shipped theme reads for each role, with the stack to force. */
    const ROLE_VARIABLES = [
      ['--dsh-font-family-text', UI_FAMILIES],
      ['--dsh-font-family-code', MONO_FAMILIES],
      ['--dsh-font-family-terminal', MONO_FAMILIES],
    ];

    /** Whether Settings already pinned one role (inline body style from the ThemePresenter). */
    function userPinned(variable) {
      const body = typeof document === 'undefined' ? null : document.body;
      return body !== null && body !== undefined && body.style.getPropertyValue(variable).trim() !== '';
    }

    /**
     * Build the sheet for the current Settings state.
     * @returns CSS text; a role the user pinned is left untouched.
     */
    function buildCss() {
      const rules = ROLE_VARIABLES
        .filter(([variable]) => !userPinned(variable))
        .map(([variable, stack]) => variable + ': ' + stack + ' !important;');
      rules.push('--dsw-font-mono: ' + MONO_FAMILIES + ';');
      return 'html{' + rules.join('') + '}';
    }

    /** Keeps one <style> element in sync with the body's inline font variables. */
    function SarasaFonts() {
      const [css, setCss] = React.useState(buildCss);
      React.useEffect(() => {
        const body = document.body;
        if (!body) return undefined;
        const sync = () => setCss((previous) => {
          const next = buildCss();
          return next === previous ? previous : next;
        });
        const observer = new MutationObserver(sync);
        observer.observe(body, { attributes: true, attributeFilter: ['style'] });
        sync();
        return () => observer.disconnect();
      }, []);
      return h('style', { 'data-plugin': 'sarasa-fonts', key: 'sarasa-fonts' }, css);
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'sarasa-mono', order: 900,
        }, SarasaFonts));
      },
    };
  },
});
