/*
Language: Python
Description: Python is an interpreted, object-oriented, high-level programming language with dynamic semantics.
Website: https://www.python.org
Category: common
*/

export default function(hljs) {
  const RESERVED_WORDS = [
    'and',
    'as',
    'assert',
    'async',
    'await',
    'break',
    'class',
    'continue',
    'def',
    'del',
    'elif',
    'else',
    'except',
    'finally',
    'for',
    '',
    'from',
    'global',
    'if',
    'import',
    'in',
    'is',
    'lambda',
    'nonlocal|10',
    'not',
    'or',
    'pass',
    'raise',
    'return',
    'try',
    'while',
    'with',
    'yield',
  ];

  const BUILT_INS = [
    '__import__',
    'abs',
    'all',
    'any',
    'ascii',
    'bin',
    'bool',
    'breakpoint',
    'bytearray',
    'bytes',
    'callable',
    'chr',
    'classmethod',
    'compile',
    'complex',
    'delattr',
    'dict',
    'dir',
    'divmod',
    'enumerate',
    'eval',
    'exec',
    'filter',
    'float',
    'format',
    'frozenset',
    'getattr',
    'globals',
    'hasattr',
    'hash',
    'help',
    'hex',
    'id',
    'input',
    'int',
    'isinstance',
    'issubclass',
    'iter',
    'len',
    'list',
    'locals',
    'map',
    'max',
    'memoryview',
    'min',
    'next',
    'object',
    'oct',
    'open',
    'ord',
    'pow',
    'print',
    'property',
    'range',
    'repr',
    'reversed',
    'round',
    'set',
    'setattr',
    'slice',
    'sorted',
    'staticmethod',
    'str',
    'sum',
    'super',
    'tuple',
    'type',
    'vars',
    'zip',
    'Dict',
    'List',
    'Any',
    'Union',
    'Optional',
    'Tuple',
    'Set',
    'TypeVar',
    'Generic',
    'Protocol',
    'Callable',
    'Type',
    'NoReturn',
    'ClassVar',
    'Final'
  ];

  const LITERALS = [
    '__debug__',
    'Ellipsis',
    'False',
    'None',
    'NotImplemented',
    'True',
  ];

  const KEYWORDS = {
    keyword: RESERVED_WORDS,
    built_in: BUILT_INS,
    literal: LITERALS
  };

  const PROMPT = {
    className: 'meta',  begin: /^(>>>|\.{3}) /
  };

  const SUBST = {
    className: 'subst',
    begin: /\{/, end: /\}/,
    keywords: KEYWORDS,
    illegal: /#/
  };

  const LITERAL_BRACKET = {
    begin: /\{\{/,
    relevance: 0
  };

  const STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/, end: /'''/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
        relevance: 10
      },
      {
        begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/, end: /"""/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
        relevance: 10
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'''/, end: /'''/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT, LITERAL_BRACKET, SUBST]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"""/, end: /"""/,
        contains: [hljs.BACKSLASH_ESCAPE, PROMPT, LITERAL_BRACKET, SUBST]
      },
      {
        begin: /([uU]|[rR])'/, end: /'/,
        relevance: 10
      },
      {
        begin: /([uU]|[rR])"/, end: /"/,
        relevance: 10
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])'/, end: /'/
      },
      {
        begin: /([bB]|[bB][rR]|[rR][bB])"/, end: /"/
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])'/, end: /'/,
        contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST]
      },
      {
        begin: /([fF][rR]|[rR][fF]|[fF])"/, end: /"/,
        contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };

  // https://docs.python.org/3.9/reference/lexical_analysis.html#numeric-literals
  const digitpart = '[0-9](_?[0-9])*';
  const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
  const NUMBER = {
    className: 'number', relevance: 0,
    variants: [
      // exponentfloat, pointfloat
      // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
      // optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      // Note: no leading \b because floats can start with a decimal point
      // and we don't want to mishandle e.g. `fn(.5)`,
      // no trailing \b for pointfloat because it can end with a decimal point
      // and we don't want to mishandle e.g. `0..hex()`; this should be safe
      // because both MUST contain a decimal point and so cannot be confused with
      // the interior part of an identifier
      { begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?\\b` },
      { begin: `(${pointfloat})[jJ]?` },

      // decinteger, bininteger, octinteger, hexinteger
      // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
      // optionally "long" in Python 2
      // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
      // decinteger is optionally imaginary
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      { begin: '\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b' },
      { begin: '\\b0[bB](_?[01])+[lL]?\\b' },
      { begin: '\\b0[oO](_?[0-7])+[lL]?\\b' },
      { begin: '\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b' },

      // imagnumber (digitpart-based)
      // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
      { begin: `\\b(${digitpart})[jJ]\\b` },
    ]
  };

  const TYPE_HINT = {
    className: 'type',
    begin: /\[/,
    end: /\]/,
    contains: [
      'self',
      {
        className: 'built_in',
        variants: [
          { begin: /\b[A-Z][a-zA-Z0-9_]*\b/ }
        ],
      },
      {
        begin: /\s*,\s*/,
        relevance: 0
      },
      NUMBER,
      STRING
    ],
    relevance: 10
  };

  const PARAMS = {
    className: 'params',
    variants: [
      {begin: /\(\s*\)/, skip: true, className: null },
      {
        begin: /\(/, end: /\)/, excludeBegin: true, excludeEnd: true,
        keywords: KEYWORDS,
        contains: ['self', PROMPT, NUMBER, STRING, hljs.HASH_COMMENT_MODE, {
          begin: /:\s*/,
          end: /(?=(,|\)))/,
          contains: [
            {
              className: 'built_in',
              variants: [
                { begin: /\b[A-Z][a-zA-Z0-9_]*\b/ }
              ]
            },
            TYPE_HINT
          ],
          relevance: 10
        }],
      },
    ],
  };
  SUBST.contains = [STRING, NUMBER, PROMPT];

  return {
    name: 'Python',
    aliases: ['py', 'gyp', 'ipython'],
    keywords: KEYWORDS,
    illegal: /(<\/|->|\?)|=>/,
    contains: [
      PROMPT,
      NUMBER,
      { begin: /\bself\b/, },
      { beginKeywords: "if", relevance: 0 },
      STRING,
      hljs.HASH_COMMENT_MODE,
      {
        variants: [
          {className: 'function', beginKeywords: 'def'},
          {className: 'class', beginKeywords: 'class'}
        ],
        end: /:/,
        illegal: /[${=;\n,]/,
        contains: [
          hljs.UNDERSCORE_TITLE_MODE,
          PARAMS,
          {
            begin: /->/, endsWithParent: true,
            contains: [
              {
                className: 'built_in',
                variants: [
                  { begin: /\b[A-Z][a-zA-Z0-9_]*\b/ }
                ]
              },
              TYPE_HINT
            ],
            relevance: 10
          }
        ]
      },
      {
        className: 'meta',
        begin: /^[\t ]*@/, end: /(?=#)|$/,
        contains: [NUMBER, PARAMS, STRING]
      },
      {
        begin: /\b(print|exec)\(/
      },
      {
        className: 'comment',
        begin: /#\s*type:\s*/,
        end: /$/,
        contains: [
          {
            className: 'built_in',
            begin: /\b[A-Z][a-zA-Z0-9_]*\b/
          },
          TYPE_HINT
        ],
        relevance: 10
      }
    ]
  };
}
