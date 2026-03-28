const getLocal = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val));

export const staffAssignService = {
  async add(payload) {
    const list = getLocal("staffAssignments");
    const newItem = { id: Date.now(), ...payload };
    list.push(newItem);
    setLocal("staffAssignments", list);
    return newItem;
  },

  async remove(id) {
    let list = getLocal("staffAssignments");
    list = list.filter((i) => i.id !== id);
    setLocal("staffAssignments", list);
  },

  async getAll() {
    return getLocal("staffAssignments");
  },
};
