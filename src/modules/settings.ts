import API from './api';
import DefaultIcons from './apps/DefaultIcons';
import ItemProperties from './apps/ItemProperties';
import CONSTANTS from './constants';
import { dialogWarning, i18n, log, warn } from './lib/lib';
import { SYSTEMS } from './systems';

export default function registerSettings() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'resetAllSettings', {
    name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
    icon: 'fas fa-coins',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  //registerSettingMenus();
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'defaultIcons', {
    name: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`,
    label: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.label`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.hint`,
    icon: 'fas fa-image',
    type: DefaultIcons,
    restricted: true,
  });

  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'itemProperties', {
    name: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`,
    label: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.label`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.hint`,
    icon: 'fas fa-cogs',
    type: ItemProperties,
    restricted: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'removeLabelButtonsSheetHeader', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'keepOldIcon', {
    name: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.hint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'allowNestedItems', {
    name: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Hint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'debug', {
    name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'debugHooks', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemFound', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'preconfiguredSystem', {
    name: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.hint`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
  }

  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  // }
}

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(event: Event, formData?: object): Promise<any> {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  for (const [name, data] of Object.entries(settings)) {
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
  const settings2 = otherSettings(true);
  for (const [name, data] of Object.entries(settings2)) {
    //@ts-ignore
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
}

function defaultSettings(apply = false) {
  return {
    defaultIcons: {
      name: `${CONSTANTS.MODULE_NAME}.setting.defaultIcons.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.defaultIcons.hint`,
      scope: 'world',
      config: false,
      default: {},
    },
    itemProperties: {
      name: `${CONSTANTS.MODULE_NAME}.setting.itemProperties.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.itemProperties.hint`,
      scope: 'world',
      config: false,
      default: {},
    },
  };
}

function otherSettings(apply = false) {
  return {
    debug: {
      name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    },

    debugHooks: {
      name: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    systemFound: {
      name: `${CONSTANTS.MODULE_NAME}.setting.systemFound.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.systemFound.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    systemNotFoundWarningShown: {
      name: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    preconfiguredSystem: {
      name: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },
  };
}

export async function checkSystem() {
  if (!SYSTEMS.DATA) {
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) return;

    await game.settings.set(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', true);

    return Dialog.prompt({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.title`),
      content: dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.content`)),
      callback: () => {
        // empty body just for avoid the error on eslint
      },
    });
  }

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemFound')) return;

  game.settings.set(CONSTANTS.MODULE_NAME, 'systemFound', true);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) {
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.title`),
      content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.content`), true),
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.confirm`),
          callback: () => {
            applyDefaultSettings();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('No'),
        },
      },
      default: 'cancel',
    }).render(true);
  }

  return applyDefaultSettings();
}

// /**
//  * Registers settings menu (button)
//  */
// function registerSettingMenus() {
//   game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'defaultIcons', {
//     name: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`,
//     label: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.label`,
//     hint: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.hint`,
//     icon: 'fas fa-image',
//     type: DefaultIcons,
//     restricted: true,
//   });

//   game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'itemProperties', {
//     name: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`,
//     label: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.label`,
//     hint: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.hint`,
//     icon: 'fas fa-cogs',
//     type: ItemProperties,
//     restricted: true,
//   });

//   game.settings.register(CONSTANTS.MODULE_NAME, 'removeLabelButtonsSheetHeader', {
//     name: i18n(`${CONSTANTS.MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.name`),
//     hint: i18n(`${CONSTANTS.MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.hint`),
//     scope: 'world',
//     config: true,
//     type: Boolean,
//     default: true,
//   });
// }

/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
  if (!game.user?.isGM) {
    return;
  }
  const defaultIcons = game.settings.get(CONSTANTS.MODULE_NAME, 'defaultIcons');
  const itemProperties = game.settings.get(CONSTANTS.MODULE_NAME, 'itemProperties');

  if (checkObjEmpty(defaultIcons)) {
    initializeDefaultIcons();
  }

  if (checkObjEmpty(itemProperties)) {
    initializeItemProperties();
  }
}

function checkObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeDefaultIcons"
 */
function initializeDefaultIcons() {
  const di = new DefaultIcons({}, {});
  let settings = di.getSettings();
  const icons = duplicate(settings);
  console.log(JSON.stringify(icons));
  Hooks.call(`${CONSTANTS.MODULE_NAME}:onInitializeDefaultIcons`, icons);
  settings = mergeObject(settings, icons);
  di.saveSettings(settings);
  log(` Initialized default item icons.`);
  ui.notifications?.info(
    game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Notifications.defaultIconsInitialized`),
    { permanent: true },
  );
}

/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeItemProperties"
 */
function initializeItemProperties() {
  const ip = new ItemProperties({}, {});
  let settings: any = ip.getSettings();
  settings = Object.entries(settings);
  settings = settings.map((type) => {
    let entries = Object.entries(type[1]);
    entries = entries.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    type[1] = Object.fromEntries(entries);
    return type;
  });
  settings = Object.fromEntries(settings);
  //settings = setDefaultItemProperties(settings);
  settings = mergeObject(settings, API.DEFAULT_PROPERTIES);
  const properties = duplicate(settings);
  Hooks.call(`${CONSTANTS.MODULE_NAME}:onInitializeItemProperties`, properties);
  console.log(JSON.stringify(properties));
  settings = mergeObject(settings, properties);
  ip.saveSettings(settings);
  log(` Initialized default item properties.`);
  ui.notifications?.info(i18n(`${CONSTANTS.MODULE_NAME}.defaultPropertiesInitialized`), {
    permanent: true,
  });
}

// /**
//  * Function responsible for out-of-the-box integration with systems.
//  *
//  * Function must return object of key-value entries:
//  *   - key   - item type
//  *   - value - objects of of key-value pairs of flattened
//  *             data names and boolean values
//  *
//  * Example of "defaults" object:
//  *   {
//  *     weapon: {
//  *       "description": true,
//  *       "attack.damage": true
//  *     },
//  *     armor: {
//  *       "weight": true
//  *     }
//  *   }
//  *
//  * @param settings
//  * @returns {Object}
//  */
// function setDefaultItemProperties(settings) {
//   let defaults;
//   switch (game.system.id) {
//     case 'dnd5e':
//       defaults = defaultPropertiesDND5e;
//       break;
//     case 'wfrp4e':
//       defaults = defaultPropertiesWFRP4e;
//       break;
//     case 'pf2e':
//       defaults = defaultPropertiesPF2e;
//       break;
//     case 'swade':
//       defaults = defaultPropertiesSwade;
//       break;
//     default:
//   }

//   if (defaults) {
//     log(` Loaded Default Properties from ${game.system.id} built-in integration.`);
//   }
//   return mergeObject(settings, defaults);
// }
