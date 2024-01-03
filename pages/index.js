import { Sidebar, TableCell, Table, Card, Button, Modal, Label, TextInput, Checkbox } from 'flowbite-react';
import axios from 'axios';
import {useEffect, useState} from 'react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

export default function Home() {
const [data , setData] = useState([])
const [openModal, setOpenModal] = useState(false);
const [id, setId] = useState('')
const [post_text, setPost] = useState('')
const [dataModal, setDataModal] = useState([])
const [editingId, setEditingId] = useState(null);

useEffect(()=>{
  fetchData();
}, []);

const fetchData = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/get-post-data', {
    method: 'post',
  });
  const result = await response.json();
  setData(result);
};

const generateData = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/generate-data/10', {
    method: 'post',
  });
  fetchData()
};
const deleteData = async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/api/delete-post-data/${id}`, {
    method: 'post',
  });
  fetchData()
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const storeData = {
    post_text,
  };
  try {
    const response = await fetch('http://localhost:8000/api/store-post-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            });
    if (response.ok) {
      console.log('Data Created:', data)
    } else {
      console.error('Data Failed to creat:', data)
    }
  }
  catch (error) {
    console.error('data error:', data);
  }
  fetchData()
}
const fetchPostByID = async (id) => {
  const response = await fetch('http://127.0.0.1:8000/api/show-post-data', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({id: id}),
  });

  const data = await response.json()
  setDataModal(data.data)
  setOpenModal(true)
  console.log("dataModal", dataModal)
};
const editDataModal = (e) => {
  //copy dataModal ke newDataModal
  const newDataModal = [...dataModal]
  //edit variable baru
  newDataModal[0] = { ...newDataModal[0], post_text: e };
  //set kembali ke datamodal
  setDataModal(newDataModal)

  console.log('new data modal', newDataModal)
}

const handleUpdate = async (id) => {
  const postText = dataModal.post_text;

  const response = await fetch(`http://127.0.0.1:8000/api/update-post-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id, post_text: postText })
  });

  fetchData(); // Ambil data lagi setelah perubahan
  setEditingId(null); // Hentikan mode editing
};


return (
    <div className='flex justify-center mt-12'>
      <div className="overflow-x-auto">
        <Card href="#" className="min-w-min">
          <div className='flex justify-between'>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                LIST BOUNTY
              </h5>
              <div className='flex'>
                <Button color='blue' className='mr-2' onClick={generateData}>Generate</Button>
                <Button onClick={() => setOpenModal(true)}>Insert</Button>
              </div>
            </div>
          <div className="overflow-x-auto">
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Insert Your Data</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                <form className='flex max-w-md flex-col gap-4' onSubmit={handleSubmit}>
                  <div>
                    <div className='mb-2 block'>
                      <Label value='Your Name'></Label>
                    </div>
                    <TextInput placeholder='Insert Your Name Here' addon='USERNAME' type='text' value={post_text} onChange={(e) => setPost(e.target.value)}></TextInput>
                  </div>
                    <div>
                      <Button type='Submit'>Submit</Button>
                    </div>
                </form>            
              </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>Created</Table.HeadCell>
              <Table.HeadCell>Updated</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {data.map((item) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>
                  {editingId === item.id ? (
                    <TextInput
                      id={`postText-${item.id}`}
                      type="text"
                      addon="POST"
                      value={dataModal.post_text}
                      onChange={(e) => setDataModal(prevState => ({ ...prevState, post_text: e.target.value }))}
                      required
                    />
                  ) : (
                    item.post_text
                  )}
                </Table.Cell>
                <Table.Cell>{item.created_at}</Table.Cell>
                <Table.Cell>{item.updated_at}</Table.Cell>
                <Table.Cell>
                <Button className='flex flex-wrap gap-2' color='red' onClick={()=> deleteData(item.id)}>
                  Delete
                </Button>
                </Table.Cell>
                <Table.Cell>
                  {editingId === item.id ? (
                    <Button className='flex flex-wrap gap-2' color='blue' onClick={() => handleUpdate(item.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button className='flex flex-wrap gap-2' color='green' onClick={() => setEditingId(item.id)}>
                      Update
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
              ))}
            </Table.Body>
          </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}