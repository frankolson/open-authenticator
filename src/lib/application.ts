import application from 'socket:application';

export async function initalizeMenu() {
  const menu = `
    Open Authenticator:
      About Open Authenticator: _
      ---
      Quit: q + CommandOrControl
    ;

    Edit:
      Undo: z + CommandOrControl
      Redo: z + CommandOrControl + Shift
      ---
      Cut: x + CommandOrControl
      Copy: c + CommandOrControl
      Paste: v + CommandOrControl
      ---
      Select All: a + CommandOrControl
    ;

    Developer:
      Reload: r + CommandOrControl
      Toggle Developer Tools: i + CommandOrControl + OptionOrAlt
    ;
  `
  await application.setSystemMenu({ index: 0, value: menu });
}