import {
  FunctionComponent,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useId,
  useState,
  createContext,
} from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { UsersVars } from "pages/users";
import Style from "styles/users/list.module.scss";
const GET_USER = gql`
  query ($length: Int) {
    users(length: $length) {
      code
    }
  }
`;
const DELETE_USER = gql`
  query ($code: String!) {
    removeUser(code: $code)
  }
`;
interface MyVars {
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}
interface result_object {
  code: string;
}

interface context_me {
  result: result_object[];
  setResult: Dispatch<SetStateAction<result_object[]>>;
  copied: string | null;
  setCopied: Dispatch<SetStateAction<string | null>>;
}

const ListInfo = createContext<context_me | null>(null);

const UsersList: FunctionComponent = () => {
  const id = useId();
  const usersvars: MyVars | null = useContext(UsersVars);
  const [result, setResult] = useState<result_object[]>([]);
  const [endList, setEndList] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [getusers, { data, loading, refetch }] = useLazyQuery(GET_USER, {
    onCompleted: (data) => {
      usersvars?.setRefresh(false);
      setResult(data.users);
      if (data && data.users.length === result.length) setEndList(true);
      else setEndList(false);
    },
  });
  useEffect(() => {
    getusers();
  }, []);

  const refreshHandler = () => {
    if (usersvars?.refresh && !loading) refetch();
  };
  const displayMoreHandler = () => {
    if (!loading && data)
      getusers({
        variables: {
          length: data.users.length,
        },
      });
  };
  const refresh_calss = () => {
    let send = `${Style.refresh}`;
    send += usersvars?.refresh ? "" : ` ${Style.cant_refresh}`;
    return send;
  };
  return (
    <>
      <h4>عن المستخدمين</h4>
      <div className={Style.users_list}>
        <button className={refresh_calss()} onClick={refreshHandler}>
          تحديث
        </button>
        <ul className={Style.list}>
          <ListInfo.Provider value={{ copied, setCopied, result, setResult }}>
            {result.length > 0 &&
              result.map((e: { code: string }, index: number) => (
                <Li key={`${id}_${index}`} code={e.code} />
              ))}
          </ListInfo.Provider>
        </ul>
        {!endList && (
          <button onClick={displayMoreHandler} className={Style.display_more}>
            اظهر المزيد
          </button>
        )}
      </div>
    </>
  );
};

const Li: FunctionComponent<{
  code: string;
}> = ({ code }) => {
  return (
    <li>
      <p>{code}</p>
      <div className={Style.btns}>
        <CopyBtn code={code} />
        <DeleteBtn code={code} />
      </div>
    </li>
  );
};

const DeleteBtn: FunctionComponent<{
  code: string;
}> = ({ code }) => {
  const contextVars = useContext(ListInfo);
  const [removeuser, { loading }] = useLazyQuery(DELETE_USER, {
    onCompleted: () => {
      contextVars?.setResult((arr) => {
        let newarr = arr.filter((e) => e.code !== code);
        return newarr;
      });
    },
  });
  const clickHandler = () => {
    if (!loading) removeuser({ variables: { code } });
  };

  return (
    <button className={Style.delete} onClick={clickHandler}>
      حذف
    </button>
  );
};
const CopyBtn: FunctionComponent<{ code: string }> = ({ code }) => {
  const contextVars = useContext(ListInfo);
  const clickHandler = () => {
    contextVars?.setCopied(code);
    navigator.clipboard.writeText(code);
  };
  const copy_class = () => {
    let send = `${Style.copy}`;
    if (code === contextVars?.copied) send += ` ${Style.copied}`;
    return send;
  };
  return (
    <button onClick={clickHandler} className={copy_class()}>
      نسخ {code === contextVars?.copied ? "!" : ""}
    </button>
  );
};

export default UsersList;
