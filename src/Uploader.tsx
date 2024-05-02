import { ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";

import { parser } from "./utils/parser";

interface Props {
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSrcDoc?: React.Dispatch<React.SetStateAction<string>>;
  indexTitle?: string;
  matchIndexColor?: string;
  style?: React.CSSProperties;
  text?: string;
}

const getPreviewDoc = (
  html: string,
  originFileName: string,
  resources: File[],
  blobUrls: string[]
) => {
  const originResourceNames = resources.map(
    (resource) => originFileName + "/" + encodeURI(resource.name)
  );

  let previewDoc = html;
  originResourceNames.forEach((resourceName, i) => {
    previewDoc = previewDoc.replace(new RegExp(resourceName, "g"), blobUrls[i]);
  });
  return previewDoc;
};

const Uploader = ({
  indexTitle,
  matchIndexColor,
  setFiles,
  setSrcDoc,
  style,
  text,
}: Props) => {
  const _modifyFileHandler = (
    file: File,
    resources: File[],
    blobResources: string[]
  ): Promise<File> => {
    console.log(file, resources, blobResources);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result;

        if (typeof content === "string") {
          const parsed = parser({
            originHtmlStr: content,
            indexTitle: indexTitle,
            matchedColor: matchIndexColor,
          });
          const originFileName = encodeURI(file.name.replace(".html", ""));

          const removeBasePath = parsed.replace(
            new RegExp(originFileName, "g"),
            ""
          );
          const blob = new Blob([removeBasePath], { type: "text/html" });
          const newFile = new File([blob], uuidv4() + ".html", {
            type: blob.type,
            lastModified: new Date().getTime(), // 현재 시간으로 lastModified 설정
          });

          // only preview
          const previewDoc = getPreviewDoc(
            parsed,
            originFileName,
            resources,
            blobResources
          );

          setSrcDoc?.(previewDoc);
          resolve(newFile);
        }
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  };

  const _unpackDirectory = (file: File): Promise<[File, string]> => {
    return new Promise((resolve) => {
      const newFile = new File([file], file.name, {
        type: file.type,
        lastModified: new Date().getTime(),
      });
      resolve([newFile, URL.createObjectURL(newFile)]);
    });
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const _files = [];
      const _previewResources = [];
      const _previewBlobResources = [];
      for (const file of e.target.files) {
        if (file.type !== "text/html") {
          const [_file, _blobUrl] = await _unpackDirectory(file);
          _files.push(_file);
          _previewResources.push(_file);
          _previewBlobResources.push(_blobUrl);
        } else continue;
      }

      for (const file of e.target.files) {
        if (file.type === "text/html") {
          const _file = await _modifyFileHandler(
            file,
            _previewResources,
            _previewBlobResources
          );
          _files.push(_file);
        } else continue;
      }

      setFiles(_files);
    }
  };

  return (
    <>
      <label htmlFor="uploader">
        <div style={style}>{text ?? "file upload"}</div>
      </label>
      <input
        style={{ display: "none" }}
        type="file"
        name="uploader"
        id="uploader"
        onChange={onChange}
        // @ts-expect-error @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
      />
    </>
  );
};

export default Uploader;
