import { sum } from 'ramda';

// interface IDir {
//   id: string;
//   parentId?: string;
//   files?: number[];
//   dirs?: IDir[];
// }

// const updateDir = (dir: IDir, files: number[], dirs: IDir[]): IDir => {
//   dir.files = files;
//   if (!dir.dirs) {
//     dir.dirs = dirs;
//   }

//   console.log('update ' + dir.id + ' with files: ' + files.join(','));
//   console.log(
//     'update ' + dir.id + ' with dirs: ' + dirs.map((d) => d.id).join(',')
//   );
//   return dir;
// };

// const searchDir = (dir: IDir, id: string): IDir | undefined => {
//   if (dir.id == id) {
//     return dir;
//   }
//   if (dir.dirs?.length > 0) {
//     let i = 0;
//     var result = undefined;
//     for (i = 0; result === undefined && i < dir.dirs.length; i++) {
//       result = searchDir(dir.dirs[i], id);
//     }
//     return result;
//   }
//   return undefined;
// };

// const addDirTo = (dir: IDir, newDirId: string): IDir => {
//   const newDir = { id: newDirId, parentId: dir.id };
//   if (!dir.dirs) {
//     dir.dirs = [];
//   }
//   dir.dirs.push(newDir);
//   return newDir;
// };

// const directoryFilesIncSubDirs = (dir: IDir): number[] => {
//   return [
//     ...(dir?.files || []),
//     ...(dir?.dirs || []).flatMap(directoryFilesIncSubDirs),
//   ];
// };

// const directoryFilesMap = (
//   dirs: IDir[] = [],
//   map: Record<string, number[]> = {}
// ): Record<string, number[]> => {
//   if (!dirs || dirs.length < 1) {
//     return map;
//   }
//   return dirs?.reduce((acc: Record<string, number[]>, dir) => {
//     return {
//       ...acc,
//       [dir.id]: directoryFilesIncSubDirs(dir),
//       ...(dir?.dirs || [] ? directoryFilesMap(dir?.dirs) : {}),
//     };
//   }, map);
// };

// const directoryFiles = (
//   dirs: IDir[] = [],
//   files: number[][] = []
// ): number[][] => {
//   if (!dirs || dirs.length < 1) {
//     return files;
//   }
//   return dirs?.reduce((acc: number[][], dir) => {
//     return [
//       ...acc,
//       directoryFilesIncSubDirs(dir),
//       ...(dir?.dirs || [] ? directoryFiles(dir?.dirs) : []),
//     ];
//   }, files);
// };

interface IDirectoryInfo {
  // path: string[];
  id: string;
  // parentId: string;
  fileSizes: number[];
}

const rootDrive = 'ROOT';

const calcDirectoryInfos = (
  rawInput: string
): Record<string, IDirectoryInfo> => {
  let currentPath: string[] = [];
  const directories: Record<string, IDirectoryInfo> = {};

  const operations = rawInput
    .split('$ ')
    .map((b) => {
      const lines = b.split('\n');
      return {
        command: lines[0],
        output: lines.slice(1).filter(Boolean),
      };
    })
    .filter((o) => o.command);

  // console.log(operations);

  operations.forEach(({ command, output }) => {
    if (command.startsWith('ls')) {
      const id = currentPath.join('/');
      const fileSizes = output
        .filter((l) => !l.startsWith('dir '))
        .map((l) => Number(l.split(' ')[0]));
      const file: IDirectoryInfo = {
        id,
        // path: currentPath.slice(),
        fileSizes,
      };
      directories[id] = file;
      return;
    }

    if (command.startsWith('cd /')) {
      currentPath = [rootDrive];
      return;
    }

    if (command.startsWith('cd ..')) {
      if (currentPath.length <= 2) {
        currentPath = [rootDrive];
      } else {
        currentPath = currentPath.slice(0, -1);
      }
      return;
    }

    if (command.startsWith('cd ')) {
      const dirId = command.split(' ')[1];
      currentPath = [...currentPath, dirId];
      return;
    }
  });

  return directories;
};

const getTotalFileSize =
  (directories: Record<string, IDirectoryInfo>) => (dir: IDirectoryInfo) => {
    return sum(
      Object.values(directories)
        .filter((d) => {
          if (d.id.startsWith(dir.id)) {
            return true;
          }
          return false;
        })
        .map((d) => sum(d.fileSizes))
    );
  };

export const partOne = (rawInput: string) => {
  // console.log(rawInput);
  // console.log(dirTree);
  // console.log(JSON.stringify(dirTree, null, 2));
  // const files = directoryFiles([dirTree]);

  // console.log(files);
  // const answer = sum(files.map(sum).filter((t) => t <= 100000));
  const max = 100000;
  const directories = calcDirectoryInfos(rawInput);

  return Object.values(directories)
    .map((d) => ({
      id: d.id,
      total: getTotalFileSize(directories)(d),
    }))
    .filter((d) => d.total <= max)
    .reduce((acc, d) => acc + d.total, 0);
};

export const partTwo = (rawInput: string) => {
  const diskSize = 70000000;
  const freeSpaceRequired = 30000000;
  const directories = calcDirectoryInfos(rawInput);
  const totalSizes = Object.values(directories).map((d) => ({
    id: d.id,
    total: getTotalFileSize(directories)(d),
  }));
  const diskSpaceUsed = totalSizes.find((d) => d.id === rootDrive)?.total;
  const currentFreeSpace = diskSize - diskSpaceUsed;
  const extraSpaceNeeded = freeSpaceRequired - currentFreeSpace;
  // console.log({
  //   diskSize,
  //   freeSpaceRequired,
  //   diskSpaceUsed,
  //   currentFreeSpace,
  //   extraSpaceNeeded,
  //   totalSizes,
  // });

  return totalSizes
    .filter((d) => d.total >= extraSpaceNeeded)
    .map((d) => d.total)
    .sort((a, b) => (a < b ? -1 : 1))[0];
};
