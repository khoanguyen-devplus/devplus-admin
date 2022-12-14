import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button } from "@themesberg/react-bootstrap";
import ChoosePhoto from "../utils/ChoosePhoto";
import { client, getBanner } from "../../../service/baseApi";
import {
  uploadSingleImage,
} from "../../../service/uploadImage";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatingForm = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAACaCAMAAAD8SyGRAAAAJFBMVEVvptSMuN1yqNWEs9qLt92Dstp9r9h1qtZ7rdd1qdZ5rNeFs9vATjLUAAADZ0lEQVR4nO3dDXbiMAxF4YqElNL973eAGaYN2JbsGITF/RbAMeqL/JM0fHwAAAAAAAAAAAAAAAAAAAAAAADgtXwt0ywi8zwtn95jGdgiK3tq2WQvd6ad96DGc7wv49niPa7RJOL4L5TeIxvLlKvjaeLh8rYr1JFKVijW8VRJ7/GN4lCu42kd5D3CMey0Ooocvcc4BOXCvvAe4wg+DXWUg/coB2AJJJHUGTrkGV1So07ZfzFxa2xXNte2ylhHCqmxFpImWfZlLSQLoLLMMeQ9DibLKGQnFLIT0wbxjB5ZZtzYiHBHUTEbC8kxucK4s+GUXMNeuxdbIWmRquwdba7sOqZ5m8WPgWG6IZAWhkjSIU3UbSLbQyNlvuE5KrPysz/eoxtJIZPUscqSqyNbmkqZ8zRu1dRLhJLpus1hNenMlLHd7rh8z6caTvsDB5D/7Y5HqtHBxKTbxbXVeY9jdD/3YrxHMrZfa5lv77EMjdVgH+vFNceJzW52KKyCGt3u9jhRbMSmuY/E8QOnOA2Sd7O8BzWi5CEtB93VMrdX2XXXyt01oE3Wyd/vZzVZJXsbizZZpfQACm2yQj6QwkNlFZQnoji+sNIeG/Ue3yjUR/Q4vrDRn2OmTVpYHmOmTRqYHqz3HuQILHWkTepMgeSUV2X+B02OL8qMgRTaZJk5kLTJMnsgOb4oqqgjbbKgJpDCKW9WRYe84JQ3ozKQtMmM2kAKxxdp1YEUji9SGgJJm0xpCSTr8ntNgRRDm9wt0zQt77NUagukqG3y+rnvMsO3BlJpk78/9j1CaX1PbkKhTa7/PM/7Nn7aAymFU96bT32Hiam5Q15k2uTdXyf++t38CsiMZPtLpPzZ3+vpNnTIi9RFu0u8DTH6xb01kKnFTaqO4W+abQ2kJE55M2/nDL053zRlX63bZDqPEnxz3iGQNxXK1jH0DqdLIFe/NPdZeutu3Fs9XQJ5dl0mFp/4jfvTftun7B/TsuzVv0vUNVC3QJrF3OCYf/ujI+/v/BDPD2TMi9sjkCE3OB6BlICHvD2n7BrhNjhOgQy3wfEKpETb4LgFMtjF7RjIWGsgx0BKpIvbNZASaIPjG8g4F7d3IMNscLwDKUE2OP6BDLIGeoFAhphvXiGQIQr5EoEMUEjzL+c+lncZtrP+TOmD/QH6TB2pYguGZwAAAABJRU5ErkJggg==");
  const [imgFile, setImgFile] = useState(null);
  const [disableUpdate, setDisableUpdate] = useState(false);
  const [isValidTitle, setIsValidTitle] = useState(false);
  const [isValidDesc, setIsValidDesc] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (!title || !desc) {
        setDisableUpdate(true)     
      } else {
        setDisableUpdate(false) 
      }
    }, [title, desc])

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    e.target.value === "" ? setIsValidTitle(true) : setIsValidTitle(false)
  };

  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
    e.target.value === "" ? setIsValidDesc(true) : setIsValidDesc(false)
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const id = toast("Creating in progress, please wait", {autoClose: false })
      let dataBanner = {
        title: title,
        desc: desc,
        image: img,
      };
      imgFile && (dataBanner = {...dataBanner, image: await uploadSingleImage(imgFile, setImg)});
      const res = await client.post(`/banner`, dataBanner);
      toast.update(id, { 
        type: "success",
        render: "Creating banner success",
        autoClose: 2000,
        onClose: () => history.push("/components/banner")
      });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">General information</h5>
        <Form>
        <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="desc">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  isInvalid={isValidTitle} 
                  name="title"
                  onChange={handleChangeTitle}
                  value={title}
                />
                <Form.Control.Feedback  type="invalid">Please fill the title input.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="desc">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  type="text"
                  isInvalid={isValidDesc} 
                  name="desc"
                  as="textarea" 
                  rows="1"
                  onChange={handleChangeDesc}
                  value={desc}
                />
                <Form.Control.Feedback type="invalid">Please fill the description input.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group id="logo">
                <Form.Label>Image</Form.Label>
                <ChoosePhoto
                  setFile={setImgFile}
                  setImg={setImg}
                  photo={img}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button 
              onClick={handleClick} 
              variant="primary" 
              type="submit"
              disabled={disableUpdate}
            >
              Save All
            </Button>
          </div>
        </Form>
      </Card.Body>
      <ToastContainer position="top-center" />
    </Card>
  );
};

export default CreatingForm;