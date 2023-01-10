import { ChangeEvent, useState, DragEvent } from 'react';

function LoadFile(file: File, setTextValue: Function, setFileName: Function) {
  var reader = new FileReader();
  reader.onload = (result) => {
    setTextValue(result.target?.result);
  };
  setFileName(file.name);
  reader.readAsText(file);
}

function Loaded(
  e: ChangeEvent<HTMLInputElement>,
  setTextValue: Function,
  setFileName: Function
) {
  var input: HTMLInputElement = e!.target;

  var file = input!.files!.item(0);
  if (file != null) {
    LoadFile(file, setTextValue, setFileName);
  }
}

function Dropped(e: DragEvent, setTextValue: Function, setFileName: Function) {
  console.log(e);
  var file = e.dataTransfer?.files[0];
  if (file) LoadFile(file, setTextValue, setFileName);
}

type FileInputProps = {
  setTextValue: Function;
};

function FileInput(props: FileInputProps) {
  const [fileName, setFileName] = useState(null);
  return (
    <div
      className="flex justify-center items-center w-3/4 m-auto h-fit"
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        Dropped(e, props.setTextValue, setFileName);
      }}
      onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
    >
      <label className="flex flex-col justify-center items-center w-full h-1/2 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col justify-center items-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="mb-3 w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fileName ? `Loaded ${fileName}` : 'Text file with privates.'}
          </p>
        </div>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            Loaded(e, props.setTextValue, setFileName)
          }
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".txt"
        />
      </label>
    </div>
  );
}

export default FileInput;
