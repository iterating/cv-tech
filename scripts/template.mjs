import Handlebars from 'handlebars';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadTemplate(templatePath) {
    const content = await fs.readFile(templatePath, 'utf8');
    return Handlebars.compile(content);
}

async function loadData(dataPath) {
    const content = await fs.readFile(dataPath, 'utf8');
    return yaml.load(content);
}

async function main() {
    try {
        // Register some helpful Handlebars helpers
        Handlebars.registerHelper('formatDate', function(date) {
            return new Date(date).toLocaleDateString();
        });

        Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });

        // Load template and data
        const templatePath = process.argv[2];
        const dataPath = process.argv[3];
        const outputPath = process.argv[4];

        if (!templatePath || !dataPath || !outputPath) {
            console.error('Usage: node template.mjs <template-file> <data-file> <output-file>');
            process.exit(1);
        }

        const template = await loadTemplate(templatePath);
        const data = await loadData(dataPath);

        // Render template
        const result = template(data);

        // Write output
        await fs.writeFile(outputPath, result, 'utf8');
        console.log(`Template rendered successfully to ${outputPath}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
