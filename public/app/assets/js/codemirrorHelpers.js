  var rules = {
    "tagname-lowercase": false,
    "attr-lowercase": true,
    "attr-value-double-quotes": false,
    "doctype-first": false,
    "tag-pair": true,
    "spec-char-escape": true,
    "id-unique": true,
    "src-not-empty": true,
    "attr-no-duplication": false,
    "title-require": true
};

CodeMirror.registerHelper("lint", "html", function(text) {
  var found = [], message;
  if (!window.HTMLHint) return found;
  var messages = HTMLHint.verify(text, rules);
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var startLine = message.line - 1,
    endLine = message.line - 1,
    startCol = message.col - 1,
    endCol = message.col;
    found.push({
      from: CodeMirror.Pos(startLine, startCol),
      to: CodeMirror.Pos(endLine, endCol),
      message: message.message,
      severity : message.type
    });
  }
  return found;
});
