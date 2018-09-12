export default url => (url ? url.replace(/^(https?:\/\/)?(www\.)?/, '') : null);
