import React from 'react'

const SongBuilder = () => {
    return (
        <div className="p-4">
            <div className="flex justify-between bg-default">
                <button>{'<-'}</button>
                <h2>Shepherd Of Fire</h2>
                <div>Chat</div>
            </div>

            <div className="flex content-center">
                <div className="mt-12 m-auto flex flex-col">
                    <div className="bg-primary h-24 w-32 flex items-center justify-around rounded shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current text-secondary w-12 h-12"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <div className="bg-secondary h-24 w-32 flex items-center justify-around rounded rounded-t-none border-t-0"></div>
                    <div className="h-24 w-32 flex items-center justify-around rounded border-dashed border-2 rounded-t-none border-t-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current text-white w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SongBuilder
