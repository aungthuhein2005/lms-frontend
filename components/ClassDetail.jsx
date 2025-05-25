import Classes from "../pages/Classes"

const classDetail=()=>{
    return(
        <>
         <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Class Info</h2>
      <div className="mb-4">
        <p><strong>ID:</strong> {Classes.id}</p>
        <p><strong>Name:</strong> {Classes.name}</p>
        <p><strong>Description:</strong> {Classes.description}</p>
        <p><strong>Schedule:</strong>{Classes.schedule}</p>
          </div>
      </div>
        </>
    )
}