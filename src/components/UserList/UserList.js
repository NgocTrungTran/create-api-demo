import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import UserService from './../../service/userService';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import NotFound from './../NotFound/NotFound';
import FileService from './../../service/fileUploadService';

function UserList() {
    const [state, setState] = useState({
        dataExists: false,
        loading: false,
        users: [],
        errorMessage: ''
    });

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        try {
            setState({ ...state, loading: true });
            async function getAllUser() {
                let userRes = await UserService.getUsers();
                if (userRes.data.length > 0) {
                    setState({
                        ...state,
                        dataExists: true,
                        users: userRes.data,
                        loading: false
                    });
                } else {
                    setState({
                        ...state,
                        dataExists: false,
                        loading: false
                    })
                }
            }
            getAllUser();
        } catch (error) {
            console.log(error);
        }

    }, []);

    const handleRemoveUser = (user) => {
        confirmAlert({
            title: `Confirm to remove ${user.name}?`,
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        try {
                            async function removeData() {
                                setState({ ...state, loading: true });
                                await UserService.removeUser(user.id);
                                await FileService.destroy(user.avatarUrl);
                                let userRes = await UserService.getUsers();
                                if (userRes.data.length > 0) {
                                    setState({
                                        ...state,
                                        dataExists: true,
                                        loading: false,
                                        users: userRes.data
                                    })
                                }
                                else {
                                    setState({
                                        ...state,
                                        dataExists: false,
                                        loading: false,
                                        users: userRes.data
                                    })
                                }
                                toast.success("User removed success.");
                            }
                            removeData();
                        } catch (error) {
                            toast.error(error.message);
                            setState({
                                ...state,
                                loading: false,
                                errorMessage: error.message
                            });
                        }
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setState({ ...state, loading: true })
        async function getData() {
            let userRes = await UserService.getUsers();

            setState({
                ...state,
                users: userRes.data.filter(user => user.name.toLowerCase().includes(keyword.toLocaleLowerCase())),
                loading: false
            })
        }
        getData();
    }

    const { dataExists, loading, users, errorMessage } = state;

    return (
        <>
            <section className="add-contact-area my-3">
                <div className="container">
                    <div className="d-flex align-items-center">
                        <h3 className="fw-bolder">User List</h3>
                        <Link to={"/user-address/add"} className="btn btn-primary btn-sm ms-2">
                            <i className="fa-solid fa-user-plus me-2"></i>
                            Add User
                        </Link>
                    </div>
                    <div>
                        <p className="fst-italic">Ea do esse elit qui enim laborum ea nulla consectetur est pariatur ex. Id et do laboris mollit ullamco laboris. Mollit consequat eiusmod nulla exercitation quis reprehenderit officia tempor. Voluptate fugiat tempor ullamco occaecat nostrud eiusmod cillum nostrud et commodo ex occaecat deserunt. Elit veniam proident esse ad laboris nostrud excepteur do.</p>
                        <div className="d-flex w-25">
                            <form className="d-flex" onSubmit={handleSearch}>
                                <input type="search" className="form-control" onInput={(e) => setKeyword(e.target.value)} />
                                <button type="submit" className="btn btn-outline-secondary btn-sm ms-2">Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section className="contact-list">
                <div className="container">
                    <div className="row">
                        {
                            loading ? <Loading /> : (!dataExists ? <NotFound /> : (
                                users.map(user => (
                                    <div className="col-4 mb-4" key={user.id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row align-items-center">
                                                    <div className="col-3">
                                                        <img className='avatar-list rounded-circle' width={250} src={user.avatarUrl} alt="" />
                                                    </div>
                                                    <div className="col-8">
                                                        <ul className="list-group">
                                                            <li className="list-group-item">
                                                                Name: <span className="fw-bold">{user.name}</span>
                                                            </li>
                                                            <li className="list-group-item">
                                                                Age: <span className="fw-bold">{user.age}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-1">
                                                        <div className="d-flex flex-column align-items-center justify-content-between">
                                                            <Link to={`/user-address/info/${user.id}`} className="btn btn-warning btn-sm"><i className="fa fa-eye"></i></Link>
                                                            <Link to={`/user-address/edit/${user.id}`} className="btn btn-primary btn-sm my-2"><i className="fa fa-edit"></i></Link>
                                                            <button className="btn btn-danger btn-sm"
                                                                onClick={() => handleRemoveUser(user)}
                                                            >
                                                                <i className="fa fa-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserList;
