// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = "/";

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "app"),
    register : path(ROOTS_DASHBOARD, "auth/register")
  },
};

// PATH_DASHBOARD.general.app => "/"+"app" => /app
