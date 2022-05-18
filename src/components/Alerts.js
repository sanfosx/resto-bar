

export default function Alerts({message}) {
  return (
    <div className="alert alert-dismissible alert-danger p-3">
        <strong>{message}</strong>
    </div>
  )
}

