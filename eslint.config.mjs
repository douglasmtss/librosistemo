import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...tseslint.configs.recommended,
    prettier,
    prettierConfig,
    // Override default ignores of eslint-config-next.
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        rules: {
            'max-len': [
                'warn',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreComments: true,
                    ignoreTrailingComments: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true
                }
            ],
            'object-curly-spacing': ['warn', 'always'],
            'no-return-assign': 'off',
            'next-line space-infix-ops': 'off',
            eqeqeq: ['warn', 'smart'],
            curly: ['warn', 'multi-line', 'consistent'],
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'newline-before-return': 'warn',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/explicit-function-return-type': 'error'
        }
    },
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts'
    ])
])

export default eslintConfig
