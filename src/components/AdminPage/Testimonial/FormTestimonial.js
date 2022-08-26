import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button } from "@themesberg/react-bootstrap";
import ChoosePhoto from "../utils/ChoosePhoto";
import { client, getTestimonial } from "../../../service/baseApi";
import { uploadSingleImage } from "../../../service/uploadImage";
import TableTestimonial from "./TableTestimonial";
import ModalDelete from "../utils/ModalDelete";

const FormTestimonial = ({ setDisableAdd }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const [image, setImage] = useState(
    "https://firebasestorage.googleapis.com/v0/b/devplus-admin.appspot.com/o/25logo-placeholder.png?alt=media&token=db37a0c6-9b95-49c0-965c-a0a6920c9e6e"
  );
  const [imageFile, setImageFile] = useState(null);

  const [fileArray, setFileArray] = useState([]);
  const [imageArray, setImageArray] = useState([]);

  const [showDefault, setShowDefault] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);

  const handleClose = () => setShowDefault(false);

  const handleChangeItemTable = (event, id) => {
    const { value, name } = event.target;
    setTestimonials((prevState) =>
      prevState.map((testimonial) => {
        if (testimonial._id === id) {
          return { ...testimonial, [name]: value };
        }
        return testimonial;
      })
    );
  };

  const handleDeleteItemTable = (id) => {
    setTestimonials((prevState) =>
      prevState.filter((testimonial) => testimonial._id !== id)
    );
  };

  const handleClickAdd = () => {
    if (name && title && content) {
      setTestimonials((prevState) => [
        ...prevState,
        { name, title, content, img: image },
      ]);
      setName("");
      setTitle("");
      setContent("");
      setImage(
        "https://firebasestorage.googleapis.com/v0/b/devplus-admin.appspot.com/o/25logo-placeholder.png?alt=media&token=db37a0c6-9b95-49c0-965c-a0a6920c9e6e"
      );
    }
  };

  useEffect(() => {
    setTestimonials((prevState) =>
      prevState.map((obj) => {
        const index = imageArray.findIndex((imgObj) => imgObj._id === obj._id);
        if (index > -1) {
          return { ...obj, img: imageArray[index].img };
        }
        return obj;
      })
    );
  }, [imageArray]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getTestimonial();
      const testimonialData = data[0];
      if (testimonialData) {
        setTestimonials(testimonialData.testimonials);
        setId(testimonialData._id);
        setDisableAdd(true);
      } else {
        setDisableUpdate(true);
      }
    };
    fetchData();
  }, [setDisableAdd]);

  const handleClickSave = async (e) => {
    e.preventDefault();

    let updatedTestimonial = {
      testimonials,
    };

    const putData = async (id, objData) => {
      const res = await client.put(`/testimonial/${id}`, objData);
      setTestimonials(res.data.testimonials);
    };

    if (imageFile) {
      const newImage = await uploadSingleImage(imageFile);
      updatedTestimonial.testimonials[testimonials.length - 1].img = newImage;
    }

    if (fileArray) {
      (async function () {
        const promises = fileArray.map(async (file) => {
          const updateImage = await uploadSingleImage(file.file);
          return { img: updateImage, _id: file._id };
        });

        const promisesResult = await Promise.all(promises);

        promisesResult.forEach((updatedObj) => {
          const index = updatedTestimonial.testimonials.findIndex(
            (obj) => obj._id === updatedObj._id
          );
          if (index > -1) {
            updatedTestimonial.testimonials[index].img = updatedObj.img;
          }
        });
        putData(id, updatedTestimonial);
      })();
    } else {
      putData(id, updatedTestimonial);
    }
  };

  const handleClickDelete = async () => {
    await client.delete(`/testimonial/${id}`);
    setTestimonials([]);
    setImage(
      "https://firebasestorage.googleapis.com/v0/b/devplus-admin.appspot.com/o/25logo-placeholder.png?alt=media&token=db37a0c6-9b95-49c0-965c-a0a6920c9e6e"
    );
    setShowDefault(false);
    setDisableUpdate(true);
    setDisableAdd(false);
  };

  return (
    <>
      <Card
        border="light"
        className="bg-white shadow-sm mb-4 table-wrapper table-responsive shadow-sm"
      >
        <Card.Body>
          <h5 className="mb-4">testimonial Content</h5>
          <TableTestimonial
            testimonials={testimonials}
            setFileArray={setFileArray}
            setImageArray={setImageArray}
            handleChange={handleChangeItemTable}
            handleDelete={handleDeleteItemTable}
          />
        </Card.Body>
      </Card>
      <Card
        border="light"
        className="bg-white shadow-sm mb-4 table-wrapper table-responsive shadow-sm"
      >
        <Card.Body>
          <h5 className="mb-4">Add more testimonial</h5>
          <Form>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="logo">
                  <Form.Label>Image</Form.Label>
                  <ChoosePhoto
                    setFile={setImageFile}
                    setImg={setImage}
                    photo={image}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group id="content">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="content"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3 d-flex justify-content-between">
              <Button onClick={handleClickAdd} variant="primary">
                Add
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <Card
        border="light"
        className="bg-white shadow-sm mb-4 table-wrapper table-responsive shadow-sm"
      >
        <Card.Body>
          <Form>
            <div className="mt-3 d-flex justify-content-between">
              <Button
                onClick={handleClickSave}
                variant="primary"
                type="submit"
                disabled={disableUpdate}
              >
                Save All
              </Button>
              <Button variant="danger" onClick={() => setShowDefault(true)}>
                Delete
              </Button>
              <ModalDelete
                showDefault={showDefault}
                handleDelete={handleClickDelete}
                handleClose={handleClose}
                name="testimonial"
              />
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default FormTestimonial;