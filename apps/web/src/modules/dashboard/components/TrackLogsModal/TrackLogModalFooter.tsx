interface TrackLogModalFooterProps {
  totalHours: number;
  handleClose: () => void;
}

export default function TrackLogModalFooter({ totalHours, handleClose }: TrackLogModalFooterProps) {
  return (
    <>
      <div className="px-6 pb-6 pt-5 flex justify-end items-center gap-2">
        <span className="text-[14px] font-semibold text-[#6B7280]">Total for the week:</span>
        <span className="text-[16px] font-semibold text-[#1F2937]">
          {totalHours > 0 ? totalHours.toFixed(1) : '0.0'}
        </span>
      </div>

      <div className="bg-[#F9FAFB] border-t border-[#E0E1E2] flex justify-end gap-3 py-5 px-6">
        <button
          type="button"
          onClick={handleClose}
          className="w-[93px] bg-[#ffffff] px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-[#fcfcfc] transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="w-[93px] px-4 py-2 rounded-md bg-[#4E916B] text-white cursor-pointer hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>
    </>
  );
}
