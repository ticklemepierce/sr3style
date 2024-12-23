// import { Box, Button, FormControlLabel, Modal, Switch } from '@mui/material';
// import { useSettingsContext } from '../context/settings';
// import { useState } from 'react';

// const style = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '1px solid #000',
//   borderRadius: 4,
//   boxShadow: 24,
//   p: 4,
// };

// export const SettingsModal = ({
//   open,
//   handleClose,
// }: {
//   open: boolean;
//   handleClose: () => void;
// }) => {
export const SettingsModal = () => {
  // const { settings, saveSettings } = useSettingsContext();

  // const [currSettings, setCurrSettings] = useState(settings);

  return 'settings modal';

  // return (
  //   <Modal
  //     open={open}
  //     onClose={handleClose}
  //     aria-labelledby={'modal-modal-title'}
  //     aria-describedby={'modal-modal-description'}
  //   >
  //     <Box sx={style}>
  //       <h2>Settings</h2>
  //       <FormControlLabel
  //         value={'autoAddInverse'}
  //         control={
  //           <Switch
  //             color={'primary'}
  //             onChange={(e) => {
  //               setCurrSettings((currSettings) => ({
  //                 ...currSettings,
  //                 autoAddInverse: e.target.checked,
  //               }));
  //             }}
  //             checked={currSettings.autoAddInverse}
  //           />
  //         }
  //         label={'Automatically add inverses: '}
  //         labelPlacement={'start'}
  //       />
  //       <Button onClick={() => saveSettings(currSettings)}>
  //         Save Settings
  //       </Button>
  //     </Box>
  //   </Modal>
  // );
};
