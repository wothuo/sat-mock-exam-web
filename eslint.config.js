const path = require('path');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      'coverage/**',
      '.DS_Store',
    ],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      import: require('eslint-plugin-import'),
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve(__dirname, 'src')],
          ],
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      // React相关规则
      'react/react-in-jsx-scope': 'off', // React 17+不需要导入React
      'react/prop-types': 'off', // 小型项目可以关闭
      
      // Import顺序规则
      'import/order': [
        'error',
        {
          groups: [
            'builtin',    // Node.js内置模块（如fs, path）
            'external',   // 第三方库（node_modules）
            'internal',   // 项目内部（@/开头的别名导入）
            'parent',     // 父级目录（../）
            'sibling',    // 同级目录（./）
            'index',      // 索引文件（./index）
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-router-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'antd',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@ant-design/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-dom'],
          'newlines-between': 'always', // 组之间添加空行
          alphabetize: {
            order: 'asc', // 按字母顺序排序
            caseInsensitive: true, // 不区分大小写
          },
        },
      ],
      
      // 禁止重复导入
      'import/no-duplicates': 'error',
    },
  },
];

