import {test, expect} from '@playwright/test'
import path, { join } from 'path'
import fs from 'fs'


test.describe('Upload and Detach file/s', () => {
    const appUrl = 'https://testautomationpractice.blogspot.com/';
    test('Upload File/s', async({page}) => {
        await page.goto(appUrl)

        await page.locator('#singleFileInput').setInputFiles('C:/Users/Pc/playwright-workspace/uploadFile/myresume.txt')
        await page.waitForTimeout(2000)
        await page.getByRole('button', {name: 'Upload Single File'}).click()
        await page.waitForTimeout(3000)

        await page.locator('#multipleFilesInput').setInputFiles(['C:/Users/Pc/playwright-workspace/uploadFile/pastresume.pdf', 'C:/Users/Pc/playwright-workspace/uploadFile/myresume.txt'])
        await page.waitForTimeout(2000)
        await page.getByRole('button', {name: 'Upload Multiple Files'}).click()
        await page.waitForTimeout(3000)

        await page.reload()
        await page.waitForTimeout(2000)

        // using dirname setInputFiles use an absolute path
        await page.locator('#multipleFilesInput').setInputFiles([path.join(__dirname, '../../uploadFile/pastResume.pdf'), 'C:/Users/Pc/playwright-workspace/uploadFile/myResume.txt'])
        await page.waitForTimeout(2000)
        await page.getByRole('button', {name: 'Upload Multiple Files'}).click()
        await page.waitForTimeout(3000)
    })

    test('Remove attached files', async({page}) => {
        await page.goto(appUrl)

        await page.locator('#singleFileInput').setInputFiles('C:/Users/Pc/playwright-workspace/uploadFile/myresume.txt')
        await page.waitForTimeout(2000)
        await page.locator('#singleFileInput').setInputFiles([])
        await page.getByRole('button', {name: 'Upload Single File'}).click()
        await page.waitForTimeout(3000)

        await page.locator('#multipleFilesInput').setInputFiles([path.join(__dirname, '../../uploadFile/pastResume.pdf'), path.join(__dirname, '../../uploadFile/myResume.txt')])
        await page.waitForTimeout(2000)
        await page.locator('#multipleFilesInput').setInputFiles([])
        await page.waitForTimeout(2000)
        await page.getByRole('button', {name: 'Upload Multiple Files'}).click()
        await page.waitForTimeout(3000)
    })

    test('Upload using page.on(filechooser)', async({}) => {

    })
})


test.describe.only('Download and get the location of file', () => {
    const appUrl = 'https://demoapps.qspiders.com/ui/download?sublist=0';

    const randomNum = Math.floor(Math.random() * 100);

    test('Download a File', async({page}) => {
        await page.goto(appUrl)

        await page.getByRole('textbox', {name: 'Enter text here'}).fill('I am going to download this Doc soon')
        await page.waitForTimeout(1000)
        await page.getByRole('textbox', {name: 'Filename'}).fill('Newfile_${randomNum}.txt')
        await page.waitForTimeout(1000)
        await page.getByRole('button', {name: 'Download'}).click()
        await page.waitForTimeout(3000)
    })

    // download file is an external Event(multiple tabs) may take time and will not handle by await cmd
    // so listen to the perticular event can handle download synchronisation issue 
    test('fetch downloaded File Path', async({page}) => {
        await page.goto(appUrl)

        await page.getByRole('textbox', {name: 'Enter text here'}).fill('I am going to download this Doc soon')
        await page.getByRole('textbox', {name: 'Filename'}).fill(`Amitfile_0${randomNum}.txt`)
        
        let [dwnloadEvent] = await Promise.all([
                                    page.waitForEvent('download'), 
                                    page.getByRole('button', {name: 'Download'}).click()
                                ])

    // let downloadPath = 'C:\Users\Pc\playwright-workspace\downloadFile'
        let filename = dwnloadEvent.suggestedFilename()
        let filePath = path.join(__dirname, '../../downloadFile', filename)       
        await dwnloadEvent.saveAs(filePath)    // now downloaded with name as 'Amitfile'
        
        console.log('Download FilePath: ', await dwnloadEvent.path());     // by default give temp location

    // fs provides a method through which we can interact with the folders/file in the system
        if(fs.existsSync(filePath)) {
            console.log(`file exists at: ${filePath}`);
        } else {
            console.log(`no file found`);
        }       
    })

    test('Download without Promise.all', async({page}) => {
        await page.goto(appUrl)

        await page.getByRole('textbox', {name: 'Enter text here'}).fill('I am going to download this Doc soon')
        await page.getByRole('textbox', {name: 'Filename'}).fill(`AmitSaurabhfile_${Math.floor(Math.random() * 1000)}.txt`)
        
    // as it might be executed before launching the URL as no await cmd provided
        let download = page.waitForEvent('download')
        await page.getByRole('button', {name: 'Download'}).click()

    // make sure file is fully downloaded(resolved) otherwise wait event to finish
        let downloadedFile = await download

    // let downloadPath = 'C:\Users\Pc\playwright-workspace\downloadFile'
        let filename = downloadedFile.suggestedFilename()           
        await downloadedFile.saveAs(path.join(__dirname, '../../downloadFile', filename))    // now downloaded with name as 'Amitfile'
    })
})