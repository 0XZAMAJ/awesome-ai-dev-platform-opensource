import chalk from "chalk";
import { Command } from "commander";
import * as dotenv from 'dotenv';
import inquirer from 'inquirer';
import { assertPieceExists, findPiece, publishPieceFromFolder } from '../utils/block-utils';

dotenv.config({path: 'packages/backend/api/.env'});

async function publishPiece(
    {apiUrl, apiKey, blockName, failOnError}:
    {apiUrl: string,
    apiKey: string,
    blockName: string,
    failOnError: boolean,}
) {
    const pieceFolder = await findPiece(blockName);
    assertPieceExists(pieceFolder)
    await publishPieceFromFolder({
        pieceFolder,
        apiUrl,
        apiKey,
        failOnError
    });
}

function assertNullOrUndefinedOrEmpty(value: any, message: string) {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        console.error(chalk.red(message));
        process.exit(1);
    }
}

export const publishBlockCommand = new Command('publish')
    .description('Publish blocks to the platform')
    .option('-f, --fail-on-error', 'Exit the process if an error occurs while syncing a block', false)
    .action(async (command) => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter the block folder name',
                placeholder: 'google-drive',
            },
            {
                type: 'input',
                name: 'apiUrl',
                message: 'Enter the API URL',
                placeholder: 'https://example.com/api',
            },
            {
                type: 'list',
                name: 'apiKeySource',
                message: 'Select the API Key source',
                choices: ['Env Variable (AP_API_KEY)', 'Manually'],
                default: 'Env Variable (AP_API_KEY)'
            }
        ]

        const answers = await inquirer.prompt(questions);
        if (answers.apiKeySource === 'Manually') {
            const apiKeyAnswers = await inquirer.prompt([{
                type: 'input',
                name: 'apiKey',
                message: 'Enter the API Key',
            }]);
            answers.apiKey = apiKeyAnswers.apiKey;
        }
        const apiKey = answers.apiKeySource === 'Env Variable (AP_API_KEY)' ? process.env.AP_API_KEY : answers.apiKey;
        assertNullOrUndefinedOrEmpty(answers.name, 'Block name is required');
        assertNullOrUndefinedOrEmpty(answers.apiUrl, 'API URL is required');
        assertNullOrUndefinedOrEmpty(apiKey, 'API Key is required');
        const apiUrlWithoutTrailSlash = answers.apiUrl.replace(/\/$/, '');
        const { failOnError } = command;

        await publishPiece({
            apiUrl: apiUrlWithoutTrailSlash,
            apiKey,
            blockName: answers.name,
            failOnError
        });
    });
