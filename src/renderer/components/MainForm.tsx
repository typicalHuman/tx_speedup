import {FaEthereum, FaGasPump, FaLink, FaPercentage} from 'react-icons/fa';
import {MdPriorityHigh} from 'react-icons/md';
import {SpeedupType} from 'logic/enums/SpeedupType';
import {useState} from 'react';
import {GetPendings, SpeedUp} from 'logic/web3/speedUp';
import {GWEI_TO_WEI} from 'logic/consts';
var LOADED_RPC = window
    .localStorage
    .getItem('rpc')as string;
if (!LOADED_RPC) 
    LOADED_RPC = '';

function OnRPCChange(setRPC : Function, value : string) {
    window
        .localStorage
        .setItem('rpc', value);
}

function GetAbsoluteValidation(pendingTable : Array < any >, fee : number, priority : number) {
    var fees = [];
    var priorities = [];
    for (let i = 0; i < pendingTable.length; i++) {
        fees.push(pendingTable[i]['maxFeePerGas'].toNumber());
        priorities.push(pendingTable[i]['maxPriorityFeePerGas'].toNumber());
    }
    var max_fee = Math.max(...fees);
    var max_priority = Math.max(...priorities);

    var max_req_fee = max_fee + max_fee / 10;
    var max_req_priority = max_priority + max_priority / 10;
    return (max_req_fee <= fee * GWEI_TO_WEI && max_req_priority <= priority * GWEI_TO_WEI);
}

async function GetPendingsHandler(fileText : string, rpc : string, setPendingTable : Function) {
    var privateKeys = new Array < string > ();
    var privateKeysString = fileText
        .toString()
        .trim();
    if (privateKeysString !== '') 
        privateKeys = privateKeysString.split(/\r?\n/);
    await GetPendings(privateKeys, rpc, setPendingTable);
}

function MainForm(props : any) {
    const [fee,
        setFee] = useState(0);
    const [priority,
        setPriority] = useState(0);
    const [percent,
        setPercent] = useState(0);
    const [rpc,
        setRPC] = useState(LOADED_RPC);
    const [speedupType,
        setSpeedupType] = useState(SpeedupType.Absolute);
    return (
        <div>
            <form>
                {speedupType == SpeedupType.Absolute && (
                    <div className="flex mb-6 w-full">
                        <div className="flex w-full">
                            <FaGasPump
                                color={props.pendingTable.length > 0
                                ? 'red'
                                : 'gray'}
                                size={'3em'}
                                className="mt-5 mr-5"/>
                            <div className="relative z-0 w-full group">
                                <input
                                    type="number"
                                    disabled={props.pendingTable.length == 0}
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    step="any"
                                    id="gas"
                                    required
                                    onChange={(e) => setFee(parseInt(e.target.value))}/>
                                <label
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Fee
                                </label>
                            </div>
                        </div>
                        <div className="flex ml-6 w-full">
                            <MdPriorityHigh
                                color={props.pendingTable.length > 0
                                ? 'green'
                                : 'gray'}
                                size={'3em'}
                                className="mt-5 mr-5"/>
                            <div className="relative z-0 w-full group">
                                <input
                                    disabled={props.pendingTable.length == 0}
                                    type="number"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    step="any"
                                    id="gas"
                                    required
                                    onChange={(e) => setPriority(parseInt(e.target.value))}/>
                                <label
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                    Priority
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                {speedupType == SpeedupType.Percent && (
                    <div className="flex mb-6 w-full">
                        <FaPercentage
                            color={props.pendingTable.length > 0
                            ? 'blueviolet'
                            : 'gray'}
                            size={'3em'}
                            className="mt-5 mr-5"/>
                        <div className="relative z-0 w-full group">
                            <input
                                disabled={props.pendingTable.length == 0}
                                type="number"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                step="any"
                                id="gas"
                                required
                                onChange={(e) => setPercent(parseInt(e.target.value))}/>
                            <label
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Percent
                            </label>
                        </div>
                    </div>
                )}

                <div className="flex mb-6">
                    <FaLink color="#1d4ed8" size={'3em'} className="mt-5 mr-5"/>
                    <div className="relative z-0 w-full group">
                        <input
                            type="text"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            id="rpc"
                            defaultValue={LOADED_RPC}
                            onChange={(e) => OnRPCChange(setRPC, e.target.value)}
                            required/>
                        <label
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            RPC Link
                        </label>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex items-center mb-4">
                        <input
                            id="checkbox-1"
                            type="checkbox"
                            step="any"
                            checked={speedupType == SpeedupType.Percent}
                            onChange={() => {
                            if (speedupType == SpeedupType.Percent) 
                                setSpeedupType(SpeedupType.Absolute);
                            else 
                                setSpeedupType(SpeedupType.Percent);
                            }}
                            value=""
                            className="w-6 h-6 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Percent
                        </label>
                    </div>
                </div>
            </form>
            <div className="flex mb-4">
                <button
                    id="submit-btn"
                    onClick={() => {
                    GetPendingsHandler(props.fileText, rpc, props.setPendingTable);
                }}
                    className="submit-btn text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Get pendings
                </button>
                <button
                    id="send-btn"
                    disabled={!(props.pendingTable.length > 0 && ((speedupType == SpeedupType.Absolute && GetAbsoluteValidation(props.pendingTable, fee, priority)) || (speedupType == SpeedupType.Percent && percent >= 10)))}
                    onClick={() => {}}
                    className="submit-btn ml-6 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    SpeedUp
                </button>
            </div>
        </div>
    );
}

export {MainForm};
