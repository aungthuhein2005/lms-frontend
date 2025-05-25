const classDetail=()=>{
    return(
        <>
         <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Class Info</h2>
      <div className="mb-4">
        <p><strong>ID:</strong> {Class.id}</p>
        <p><strong>Name:</strong> {Class.name}</p>
        <p><strong>Description:</strong> {Class.description}</p>
          </div>
      </div>
        </>
    )
}