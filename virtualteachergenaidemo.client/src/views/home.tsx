import Menu from '../components/menu';


function Home(props: any) {
   
   
    return (
        <div>
           
            <div>
                <div>
                    <h1 className="title">{props.title}</h1>
                </div>
                <Menu />
           
            </div>
        </div>
    )
};

export default Home;

