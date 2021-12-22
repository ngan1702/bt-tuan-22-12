import {AxiosBasic, AxiosDownload} from "../services/api";
import urls from './urls'

const getClasses = () => {
    return AxiosBasic({
        url: urls.getClasses,
        method: 'GET'
    })
}

const getClassById = ({id}) => {
    return AxiosBasic({
        url: `${urls.getClassById}${id}`,
        method: 'GET'
    })
}

const getGrade = ({classID}) => {
    return AxiosBasic({
        url: urls.getGrade,
        method: 'GET',
        data:{classID}
    })
}

const createClass = ({name, description,ownerId}) => {
    return AxiosBasic({
        url: urls.createClass,
        method: 'POST',
        data:{
            name,
            description,
            ownerId
        }
    })
}

const inviteMember = async ({email, classId, role}) => {
    return AxiosBasic({
        url: urls.invite,
        method: 'POST',
        data: {
            email,
            classId,
            role
        }
    })
}

const verifyMember = async ({inviteToken}) => {
    return AxiosBasic({
        url: urls.verify,
        method: 'POST',
        data: {
            inviteToken
        }
    })
}

const updateAssignment = async ({classId,assignments}) => {
    return AxiosBasic({
        url: urls.updateAssignment,
        method: 'POST',
        data: {
            classId,
            assignments
        }
    })
}

const exportStudentList = async ({classId}) => {
    const uri = urls.downloadStudentList.split('/');
    console.log(uri);
    const response = await AxiosDownload({
        url: `/${uri[1]}/${classId}/${uri[3]}`,
        method: 'GET',
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'studentList.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
}

const importStudentList = ({classId, file}) => {
    const uri = urls.uploadStudentList.split('/');
    return AxiosBasic({
        url: `/${uri[1]}/${classId}/${uri[3]}`,
        method: 'POST',
        data: file,
        headers: {
            'Content-Type': 'multipart/form-data',
        }
      });
}

const getGradeList = async ({classId}) => {
    const uri = urls.showStudentGradeList.split('/');
    return await AxiosBasic({
        url: `/${uri[1]}/${classId}/${uri[3]}`,
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
        }
      });
}

const classApi = {
    getClasses,
    getClassById,
    createClass,
    getGrade,
    inviteMember,
    verifyMember,
    updateAssignment,
    exportStudentList,
    importStudentList,
    getGradeList,
}

export default classApi