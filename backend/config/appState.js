let memoryMode = false;

function setMemoryMode(value) {
  memoryMode = Boolean(value);
}

function isMemoryMode() {
  return memoryMode;
}

module.exports = { isMemoryMode, setMemoryMode };

