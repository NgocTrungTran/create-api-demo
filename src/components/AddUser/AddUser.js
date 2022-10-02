import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LocationService from './../../service/locationService';
import Loading from './../Loading/Loading';
import UserService from './../../service/userService';
import { toast } from 'react-toastify';
import defaultAvatar from '../../asset/images/avatardefault.png';
import FileService from './../../service/fileUploadService';


function AddUser() {
    const [state, setState] = useState({
        loading: false,
        provinces: [],
        districts: [],
        wards: [],
        errorMessage: ''
    });

    const [select, setSelect] = useState({
        province_id: "92",
        district_id: "925"
    });

    const { province_id, district_id } = select;


    const [locationRegion, setLocationRegion] = useState({
        provinceId: '92',
        provinceName: 'Thành phố Cần Thơ',
        districtId: '925',
        districtName: 'Huyện Cờ Đỏ',
        wardId: '31261',
        wardName: 'Thị trấn Cờ Đỏ',
        address: ''
    });

    const [user, setUser] = useState({
        name: '',
        age: '',
        avatarUrl: '',
        locationRegion: locationRegion
    });

    const [uploadClou, setUploadClou] = useState({
        uploading: false,
        file: ''
    })

    useEffect(() => {
        try {
            async function getData() {
                let resProvinces = await LocationService.getProvinces();
                let resDistricts = await LocationService.getDistricts(province_id);
                let resWards = await LocationService.getWards(district_id);
                setState({
                    ...state,
                    loading: false,
                    provinces: resProvinces.data.results,
                    districts: resDistricts.data.results,
                    wards: resWards.data.results
                });
            }
            getData();
        } catch (error) {
            setState({
                ...state,
                loading: false,
                errorMessage: error.message
            })
            toast.error(error.message);
        }

        return () => {
            if (user.avatarUrl) {
                async function clearAvatar() {
                    await FileService.destroy(user.avatarUrl);
                }
                clearAvatar();
            }
        }
    }, [province_id, district_id]);

    const { loading, provinces, districts, wards, errorMessage } = state;

    const handleInputValue = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeValue = async (e) => {
        if (e.target.name === "province_id") {
            let province_value = e.target.value;
            let resDistricts = await LocationService.getDistricts(province_value);
            let first_district_id = resDistricts.data.results[0].district_id;
            let resWards = await LocationService.getWards(first_district_id);

            setLocationRegion({
                ...locationRegion,
                provinceId: province_value,
                provinceName: e.target.options[e.target.options.selectedIndex].text,
                districtId: first_district_id,
                districtName: resDistricts.data.results[0].district_name,
                wardId: resWards.data.results[0].ward_id,
                wardName: resWards.data.results[0].ward_name
            });

            setSelect({
                ...select,
                province_id: province_value,
                district_id: first_district_id
            });

        } else if (e.target.name === "district_id") {
            let district_value = e.target.value;
            let resWards = await LocationService.getWards(district_value);
            let first_ward_id = resWards.data.results[0].ward_id;

            setLocationRegion({
                ...locationRegion,
                districtId: district_value,
                districtName: e.target.options[e.target.options.selectedIndex].text,
                wardId: first_ward_id,
                wardName: resWards.data.results[0].ward_name
            });
            setSelect({
                ...select,
                [e.target.name]: e.target.value
            });
        } else if (e.target.name === "ward_id") {
            setLocationRegion({
                ...locationRegion,
                wardId: e.target.value,
                wardName: e.target.options[e.target.options.selectedIndex].text,
            });
        } else {
            setLocationRegion({
                ...locationRegion,
                [e.target.name]: e.target.value
            });
        }
        setUser(prev => ({
            ...prev,
            locationRegion: locationRegion 
        }));
    };

    const changeAvatar = (e) => {
        let select_file = e.target.files[0];
        let fakeAvatarUrl = URL.createObjectURL(select_file)
        setUser({
            ...user,
            avatarUrl: fakeAvatarUrl
        })
        setUploadClou({
            ...uploadClou,
            file: select_file
        })
    };

    const handleUpload = () => {
        if (uploadClou.file) {
            setUploadClou({ ...uploadClou, uploading: true })
            async function uploadAvatar() {
                let uploadResult = await FileService.upload(uploadClou.file);
                user.avatarUrl = uploadResult.data.url
                setUploadClou({ ...uploadClou, uploading: false })
                toast.success("Avatar uploaded success.")
            }
            uploadAvatar();
        }
        else {
            toast.info("Please select an avatar");
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            setState({ ...state, loading: true });
            async function postData() {
                let result = await UserService.createUsers(user) 
                if (result.data) {
                    toast.success("User created successfully.");
                    setState({ ...state, loading: false });
                }
            }
            postData();
        } catch (error) {
            setState({
                ...state,
                loading: false,
                errorMessage: error.message
            })
            toast.error(error.message);
        }
    }



    return (
        <>
            <section className='create-user-info'>
                <div className="container">
                    <h3 className="fw-bolder text-success">Add User</h3>
                    <p className="fst-italic">Anim id aliqua cillum duis. Amet consequat incididunt culpa non. Aute ea tempor officia elit ut. Cupidatat proident amet est dolore exercitation nisi reprehenderit deserunt laboris labore consectetur excepteur veniam.</p>
                </div>
            </section>
            <section className='create-user'>
                {
                    loading ? <Loading /> : (
                        <div className='container'>
                            <div className='row'>
                                <div className='col-4'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="fw-bolder mb-1">Name:</label>
                                            <input type="text" className="form-control" placeholder="Name" name="name" id="name" onInput={handleInputValue} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="age" className="fw-bolder mb-1">Age:</label>
                                            <input type="text" className="form-control" placeholder="Age" name="age" id="age" onInput={handleInputValue} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="province" className="fw-bolder mb-1">Province</label>
                                            <select className='select form-select' name='province_id' id="province" onChange={handleChangeValue}>
                                                {
                                                    provinces.map((province) => (
                                                        <option value={province.province_id} key={province.province_id}>{province.province_name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="district" className="fw-bolder mb-1">District</label>
                                            <select className='select form-select' name='district_id' id="district" onChange={handleChangeValue}>
                                                {
                                                    districts.map((district) => (
                                                        <option value={district.district_id} key={district.district_id}>{district.district_name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="ward" className="fw-bolder mb-1">Ward</label>
                                            <select className='select form-select' name='ward_id' id="ward" onChange={handleChangeValue}>
                                                {
                                                    wards.map((ward) => (
                                                        <option value={ward.ward_id} key={ward.ward_id}>{ward.ward_name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="address" className="fw-bolder mb-1">Address:</label>
                                            <input type="text" className="form-control" placeholder="Address" name="address" id="address" onInput={handleChangeValue} />
                                        </div>

                                        <div className="mb-3">
                                            <button type='submit' className='btn btn-success me-2'>Create</button>
                                            <Link to={"/user-address"} className="btn btn-dark">Close</Link>
                                        </div>
                                    </form>
                                </div>
                                <div className='col-4'>
                                    <div className='d-flex flex-column align-items-center'>
                                        <div className='select-avatar'>
                                            <img className='avatar-lg' src={user.avatarUrl || defaultAvatar} alt=""
                                                onClick={() => document.querySelector("#fileAvatar").click()}
                                            />
                                            <div className="overlay" onClick={() => document.querySelector("#fileAvatar").click()}>
                                                <div className="text">Select avatar</div>
                                            </div>
                                        </div>
                                        <input className="form-control d-none" accept='image/*' type="file" id="fileAvatar" onChange={changeAvatar} />
                                        {
                                            uploadClou.uploading ? (
                                                <button className="btn btn-primary" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    Loading...
                                                </button>
                                            ) : <button className='btn btn-primary mt-2' onClick={handleUpload}>Upload</button>
                                        }
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

export default AddUser;