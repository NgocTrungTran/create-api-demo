import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserService from '../../service/userService';
import Loading from './../Loading/Loading';

function InfoUser() {
    const [state, setState] = useState({
        loading: false,
        user: {},
        locationRegion: {},
        errorMessage: ''
    })
    const { userId } = useParams();

    useEffect(() => {
        try {
            setState({ ...state, loading: true })
            async function getData() {
                let userRes = await UserService.getUser(userId);
                setState({
                    ...state,
                    user: userRes.data,
                    locationRegion: userRes.data.locationRegion,
                    loading: false
                })
            }
            getData();
        } catch (error) {
            setState({ ...state, loading: false, errorMessage: error.message })
        }
    }, [])

    const { loading, user, locationRegion, errorMessage } = state;
    return (
        <>
            <section className='view-contact-info'>
                <div className="container">
                    <div className="d-flex align-items-center">
                        <h3 className="fw-bolder text-warning">User information</h3>
                        <Link to={"/user-address"} className="btn btn-warning btn-sm ms-2">
                            <i className="fa fa-backward me-2"></i>
                            Back
                        </Link>
                    </div>

                    <p className="fst-italic">Lorem proident sit aute esse eiusmod enim labore pariatur nulla dolore amet laborum nostrud ex. Labore eiusmod do velit do fugiat quis culpa. Do nulla duis ullamco irure ex consequat et dolore non id cillum eu consectetur eiusmod. Ullamco pariatur ex sint veniam labore exercitation Lorem enim officia sint commodo sint. Tempor minim aliqua dolore laboris et.</p>
                </div>
            </section>
            <section className='view-contact-detail'>
                {
                    loading ? <Loading /> : (
                        <div className='container'>
                            <div className='row'>
                                <div className='col-3'>
                                    <img className='img-thumbnail w-100' src={user.avatarUrl} alt="" />
                                </div>
                                <div className='col-9'>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <ul className="list-group">
                                                    <li className="list-group-item">
                                                        Name: <span className="fw-bold">
                                                            {user.name}
                                                        </span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Age: <span className="fw-bold">
                                                            {user.age}
                                                        </span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Province: <span className="fw-bold">
                                                            {locationRegion.provinceName}
                                                        </span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        District: <span className="fw-bold">
                                                            {locationRegion.districtName}
                                                        </span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Ward: <span className="fw-bold">
                                                            {locationRegion.wardName}
                                                        </span>
                                                    </li>
                                                    <li className="list-group-item">
                                                        Adderss: <span className="fw-bold">
                                                            {locationRegion.address}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
        </>
    );
}

export default InfoUser;