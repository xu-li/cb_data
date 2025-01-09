// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
import { writeJSON, removeFile, readTXT } from 'https://deno.land/x/flat@0.0.14/mod.ts'

const REGEX_JQUERY = /^jQuery\((.*?)\);$/

// 转债代码，转债代码，转债名称, 正股简称，正股代码，正股价，转股价，转股价值，债现价，转股溢价率，信用评级，发行规模
// "113070", "113070.SH", "渝水转债", "重庆水务", "601158", 4.64, 4.98, 93.3735, 109, 32.81, "AAA", 19
const ATTRIBUTES = ['SECURITY_CODE', 'SECUCODE', 'SECURITY_NAME_ABBR', 'SECURITY_SHORT_NAME', 'CONVERT_STOCK_CODE',
    'CONVERT_STOCK_PRICE', 'TRANSFER_PRICE', 'TRANSFER_VALUE', 'CURRENT_BOND_PRICE', 'TRANSFER_PREMIUM_RATIO', 'RATING', 'ACTUAL_ISSUE_SCALE']

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

    if (content.result && content.result.data) {
        for (let i = 0; i < content.result.data.length; i++) {
            const item = content.result.data[i]
            const obj = {}
            for (let j = 0; j < ATTRIBUTES.length; j++) {
                obj[ATTRIBUTES[j]] = item[j]
            }
            content.result.data[i] = obj
        }
    }

    await writeJSON(`data/${today}/${filename}.json`, content)
} catch (e) {
    console.log(e)
}

// Remove the downloaded file
// await removeFile(filename)