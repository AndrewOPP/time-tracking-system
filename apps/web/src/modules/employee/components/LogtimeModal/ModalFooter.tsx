interface Props {
  onClose: () => void;
  isSaving: boolean;
}

export const ModalFooter = ({ onClose, isSaving }: Props) => {
  return (
    <div className="bg-[#F9FAFB] border-t border-[#E0E1E2] flex justify-end gap-3 pt-4 px-5 pb-4 mt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-[8px] cursor-pointer"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSaving}
        className="px-8 py-2.5 font-semibold text-white bg-[#4E916B] hover:bg-[#3d7254] rounded-[8px] disabled:opacity-50 cursor-pointer"
      >
        Save
      </button>
    </div>
  );
};
