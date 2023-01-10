import { FaEthereum, FaGasPump, FaLink } from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';

var LOADED_RPC = window.localStorage.getItem('rpc') as string;
if (!LOADED_RPC) LOADED_RPC = '';

function OnRPCChange() {
  var rpc_input = document.getElementById('rpc') as HTMLInputElement;
  window.localStorage.setItem('rpc', rpc_input.value);
}
function MainForm(props: any) {
  return (
    <div>
      <form>
        <div className="flex mb-6 w-full">
          <div className="flex mb-6 w-full">
            <FaGasPump color="red" size={'3em'} className="mt-5 mr-5" />
            <div className="relative z-0 w-full group">
              <input
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                step="any"
                id="gas"
                required
                onChange={(e) => props.setGas(e.target.value)}
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Fee
              </label>
            </div>
          </div>
          <div className="flex mb-6 ml-6 w-full">
            <MdPriorityHigh color="green" size={'3em'} className="mt-5 mr-5" />
            <div className="relative z-0 w-full group">
              <input
                type="number"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                step="any"
                id="gas"
                required
                onChange={(e) => props.setGas(e.target.value)}
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Priority
              </label>
            </div>
          </div>
        </div>
        <div className="flex mb-6">
          <FaLink color="#1d4ed8" size={'3em'} className="mt-5 mr-5" />
          <div className="relative z-0 w-full group">
            <input
              type="text"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              id="rpc"
              defaultValue={LOADED_RPC}
              onChange={() => OnRPCChange()}
              required
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              RPC Link
            </label>
          </div>
        </div>

        {/* <div className="flex">
          <div className="flex items-center mb-4">
            <input
              id="checkbox-1"
              type="checkbox"
              step="any"
              checked={props.disperseType == DisperseType.Fixed}
              onChange={() => {
                if (props.disperseType == DisperseType.Fixed)
                  props.setDisperseType(DisperseType.All);
                else props.setDisperseType(DisperseType.Fixed);
              }}
              value=""
              className="w-6 h-6 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Fixed
            </label>
          </div>
          <div className="flex items-center mb-4 ml-3">
            <input
              id="checkbox-1"
              type="checkbox"
              step="any"
              checked={props.disperseType == DisperseType.Remainder}
              onChange={() => {
                if (props.disperseType == DisperseType.Remainder)
                  props.setDisperseType(DisperseType.All);
                else props.setDisperseType(DisperseType.Remainder);
              }}
              value=""
              className="w-6 h-6 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Remainder
            </label>
          </div>
          <div className="ether-toggle absolute">
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={() => {
                  if (props.currencyType == CurrencyType.Token)
                    props.setCurrencyType(CurrencyType.Ether);
                  else props.setCurrencyType(CurrencyType.Token);
                }}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                Tokens
              </span>
            </label>
          </div>
        </div> */}
      </form>
      <div className="flex mb-4">
        <button
          id="submit-btn"
          disabled={
            (props.from_count != props.to_count && props.to_count != 1) ||
            props.gas <= 0
          }
          onClick={() => {
            props.setConfirmationShow(true);
            props.setValue(
              parseFloat(
                (document.getElementById('value') as HTMLInputElement).value
              )
            );
          }}
          className="submit-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Get pendings
        </button>
        <button
          id="send-btn"
          disabled={
            true
          }
          onClick={() => {
            props.setConfirmationShow(true);
            props.setValue(
              parseFloat(
                (document.getElementById('value') as HTMLInputElement).value
              )
            );
          }}

          className="submit-btn ml-6 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          SpeedUp
        </button>
      </div>
    </div>
  );
}

export { MainForm };