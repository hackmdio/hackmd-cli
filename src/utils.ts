import * as fs from 'fs-extra'

export async function pipeToFile(stream: any, output: string) {
  const fileStream = fs.createWriteStream(output)

  await new Promise((resolve, reject) => {
    if (!stream) {
      return reject('No stream given')
    }

    stream.pipe(fileStream)
    stream.on('error', (err: any) => {
      reject(err)
    })
    fileStream.on('finish', function () {
      resolve()
    })
  })
}
