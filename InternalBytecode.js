// Placeholder file to avoid Metro symbolicator errors when a stack frame
// references "InternalBytecode.js" but the file doesn't exist in the
// project root. Metro's symbolicator tries to read source files to build
// a code frame. If a frame contains a path that isn't available, Metro
// will throw ENOENT and crash the symbolication flow.

// This file is intentionally empty. It's safe to keep as a short-term
// development workaround. If you prefer a permanent fix, see the notes
// below on diagnosing and addressing the root cause.

/* eslint-disable no-unused-vars */

const __placeholder_for_metro_symbolication = true;

export default __placeholder_for_metro_symbolication;
