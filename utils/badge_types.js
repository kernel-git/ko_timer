import React from 'react';

import PlayBadge from '../assets/play-badge.svg';
import RedBadge from '../assets/red-badge.svg';
import EditBadge from '../assets/edit-badge.svg';
import RockHandBadge from '../assets/rock-hand-badge.svg';
import SettingsBadge from '../assets/settings-badge.svg';
import CrossBadge from '../assets/cross-badge.svg';
import AddBadge from '../assets/add-badge.svg';
import ArrowUpBadge from '../assets/arrow-up-badge.svg';
import ArrowDownBadge from '../assets/arrow-down-badge.svg';
import ArrowBackBadge from '../assets/arrow-back-badge.svg';
import DeleteBadge from '../assets/delete-badge.svg';
import InfoBadge from '../assets/info-badge.svg';
import SaveBadge from '../assets/save-badge.svg';
import ReloadBadge from '../assets/reload-badge.svg';

const BADGE_TYPES = {
  play: PlayBadge,
  edit: EditBadge,
  rockHand: RockHandBadge,
  settings: SettingsBadge,
  cross: CrossBadge,
  red: RedBadge,
  add: AddBadge,
  arrowUp: ArrowUpBadge,
  arrowDown: ArrowDownBadge,
  arrowBack: ArrowBackBadge,
  delete: DeleteBadge,
  info: InfoBadge,
  save: SaveBadge,
  reload: ReloadBadge,
};

export const getBadge = (type, size) => {
  const SelectedBadge = BADGE_TYPES[type];
  return SelectedBadge ? (
    <SelectedBadge width={size} height={size} />
  ) : (
    <InfoBadge width={size} height={size} />
  );
};
