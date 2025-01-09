// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import { writeJSON, removeFile, readTXT } from 'https://deno.land/x/flat@0.0.14/mod.ts'

const REGEX_JQUERY = /jQuery\((.*?)\);/g

const today = new Date().toISOString().split('T')[0]

// Step 1: Create YYYY-mm-dd directory
try {
    await Deno.mkdir(`data/${today}`);
} catch (e) {
    // directory already exists
}

// Read the downloaded_filename text file and remove "jQuery"
const filename = Deno.args[0]
let content = await readTXT(filename)
content = content.replace(REGEX_JQUERY, '$1')
try {
    content = JSON.parse(content)
    await writeJSON(`data/${today}/${filename}.json`, content)
} catch (e) {
    console.log(e)
}

// Remove the downloaded file
// await removeFile(filename)