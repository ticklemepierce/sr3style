import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@chakra/dialog';
import { SetType } from '../types';
import { SetSelector } from './SetSelector';
import { capitalizeFirstLetter } from '../utils/text';

export const AddItemsModal = ({
  setType,
  onClose,
}: {
  setType: SetType;
  onClose: () => void;
}) => {
  return (
    <DialogRoot placement={'center'} open={true}>
      <DialogContent maxHeight={'95vw'}>
        <DialogHeader>
          <DialogTitle>
            Select {capitalizeFirstLetter(setType)} to Learn
          </DialogTitle>
        </DialogHeader>
        <DialogBody overflow={'auto'}>
          <SetSelector setType={setType} />
        </DialogBody>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </DialogRoot>
  );
};
