import type {NextApiRequest, NextApiResponse} from 'next'
import fsp from 'fs/promises'
import fs from 'fs/promises'
import path, {extname} from 'path'
import * as process from "process";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  getAllPosts().then(result => res.status(200).json(result))
}

async function getAllPosts() {
  const dir = path.join(process.cwd(), 'posts/article');
  const readResult = await fsp.readdir(dir);
  const dirInfoPromises = readResult.map((e) => {
    const elementPath = path.join(`${dir}/${e}`);
    return new Promise((resolve) => {
      fs.stat(elementPath).then((result) => {
        const ret = {
          name: e,
          isDir: result.isDirectory(),
          extName: extname(elementPath),
          path: elementPath,
        };
        resolve(ret);
      });
    });
  });
  return await Promise.all(dirInfoPromises);
}
