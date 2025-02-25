import FieldController from '../../../Controller';

export default class RelationshipController extends FieldController {
  getRefList() {
    const { getListByKey } = this.adminMeta;
    const { ref } = this.config;
    return getListByKey(ref);
  }
  getQueryFragment = (path = this.path) => {
    return `
      ${path} {
        id
        _label_
      }
    `;
  };
  getFilterGraphQL = ({ type, value }) => {
    if (type === 'contains') {
      return `${this.path}_some: {id: "${value}"}`;
    } else if (type === 'is') {
      return `${this.path}: {id: "${value}"}`;
    }
  };
  getFilterLabel = ({ label }) => {
    return `${this.label} ${label.toLowerCase()}`;
  };
  formatFilter = ({ label, value }) => {
    return `${this.getFilterLabel({ label })}: "${value}"`;
  };

  serialize = data => {
    const { path } = this;
    const { many } = this.config;

    let value = data[path];

    if (many) {
      let ids = [];
      if (Array.isArray(value)) {
        ids = value.map(x => x.id);
      }
      return {
        disconnectAll: true,
        connect: ids.map(id => ({ id })),
      };
    }

    if (!value) {
      return { disconnectAll: true };
    }

    return { connect: { id: value.id } };
  };
  getDefaultValue = () => {
    const { defaultValue, many } = this.config;
    return many ? defaultValue || [] : defaultValue || null;
  };

  getFilterTypes = () => {
    const { many } = this.config;
    if (many) {
      return [
        {
          type: 'contains',
          label: 'Contains',
          getInitialValue: () => null,
        },
      ];
    } else {
      return [
        {
          type: 'is',
          label: 'Is',
          getInitialValue: () => null,
        },
      ];
    }
  };
}
