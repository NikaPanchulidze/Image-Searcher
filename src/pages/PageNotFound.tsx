import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/main');
  };

  return (
    <main>
      <div>
        <h1 className='page-error'>
          The page you are looking for could not be found!
        </h1>
        <button className='btn-bage-error' onClick={handleGoBack}>
          &larr; Go back
        </button>
      </div>
    </main>
  );
}

export default PageNotFound;
