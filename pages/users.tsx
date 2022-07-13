import UserGenerator from "components/users/generator";
import UsersList from "components/users/list";
import {
  useState,
  createContext,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import Style from "styles/users/index.module.scss";

interface Users_Interface {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}
export const UsersVars = createContext<Users_Interface | null>(null);

const Users: FunctionComponent = () => {
  const [refresh, setRefresh] = useState(false);
  const send = { refresh, setRefresh };
  return (
    <main className={Style.users}>
      <h1>Users</h1>
      <UsersVars.Provider value={send}>
        <UserGenerator />
        <UsersList />
      </UsersVars.Provider>
    </main>
  );
};
export default Users;
